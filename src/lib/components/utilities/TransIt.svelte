<script>
	export let type;
	export let modifier = '';

	const limitOneMods = [
		[
			'b-t',
			't-b',
			'l-r',
			'r-l',
			'tl-br',
			'tr-bl',
			'bl-tr',
			'br-tl',
			'm-o__hor',
			'm-o__ver',
			'm-o__rad'
		]
	];

	const types = {
		'border-fill': {
			restrictedActions: [],
			defaultAction: 'hover',
			requiresModifier: limitOneMods[0]
		},
		brighten: {
			restrictedActions: [],
			defaultAction: 'hover'
		},
		fade: {
			restrictedActions: [],
			defaultAction: 'hover'
		},
		'text-color': {
			restrictedActions: [],
			defaultAction: 'hover'
		},
		'bg-fill': {
			restrictedActions: [],
			defaultAction: 'hover',
			requiresModifier: limitOneMods[0]
		},
		underline: {
			restrictedActions: [],
			defaultAction: 'hover',
			requiresModifier: limitOneMods[0]
		}
	};

	const createAddClassHandler = (el, types) => (e) =>
		types.forEach((type) => el.classList.add(`_${type}`));
	const createRemoveClassHandler = (el, types) => (e) =>
		types.forEach((type) => el.classList.remove(`_${type}`));
	const createToggleClassHandler = (el, types) => (e) =>
		types.forEach((type) => el.classList.toggle(`_${type}`));

	const actionsMap = {
		hover: (el, types) => ({
			mouseover: createAddClassHandler(el, types),
			mouseleave: createRemoveClassHandler(el, types)
		}),
		focus: (el, types) => ({
			focus: createAddClassHandler(el, types),
			blur: createRemoveClassHandler(el, types)
		}),
		click: (el, types) => ({ click: createToggleClassHandler(el, types) })
	};

	function getActions(action = '') {
		const actionArr = action.match(/\$[a-z]+/g);
		const replaced = actionArr?.map((action) => action.replace('$', ''));
		return replaced;
	}

	function excludeRestrictedActions(actions, type) {
		const { restrictedActions: typeRestrictedActions, defaultAction } = types[type];
		let warning = '';

		// first check if type allows actions
		let excludedActions = actions.reduceRight((excludedActions, action, i, _actions) => {
			if (typeRestrictedActions.includes(action)) excludedActions.push(_actions.splice(i, 1));

			return excludedActions;
		}, []);

		if (excludedActions.length) {
			const plural = excludedActions.length > 1;
			warning += `${excludedActions.join(', ')} ${
				plural ? 'are not supported event types' : 'is not a support event type'
			} for ${type}.\n`;
		}

		// now check if the action is allowed at all
		excludedActions = actions.reduceRight((excludedActions, action, i, _actions) => {
			if (!Object.keys(actionsMap).includes(action)) excludedActions.push(_actions.splice(i, 1));
			return excludedActions;
		}, []);

		if (excludedActions.length) {
			const plural = excludedActions.length > 1;
			warning += `${excludedActions.join(', ')} ${
				plural ? 'are not supported event types' : 'is not a support event type'
			} \n`;
		}

		// if none of the provided actions match, set default action
		if (!actions.length) {
			warning += `${defaultAction} will be added by default.`;
			actions.push(defaultAction);
		} else if (excludedActions.length) {
			warning += `Only ${actions.join(', ')} will be added.`;
		}

		if (warning) console.warn(warning);
	}

	function filterModifiers(modifiers) {
		const _modifiers = modifiers ? modifiers.split(' ') : [];

		for (let modInd = _modifiers.length - 1; modInd >= 0; modInd--) {
			for (let limitArr of limitOneMods) {
				if (!limitArr.includes(_modifiers[modInd])) continue;

				const foundAnother = _modifiers
					.filter((_, _modInd) => _modInd !== modInd)
					.some((_mod) => limitArr.includes(_mod));

				if (foundAnother) {
					const [removed] = _modifiers.splice(modInd, 1);

					console.warn(
						`Modifier '${removed}' is part of a group of modifiers that can't have more than one in the group assigned. It has been omitted.`
					);
				}
			}
		}

		return _modifiers;
	}

	function set(el, [userTypes, modifiers]) {
		if (!userTypes) return;

		let classes = [];
		const settings = userTypes.matchAll(/(?<type>[a-z\-]+)(?<action>\$[a-z$]+)?/g);
		const _modifiers = filterModifiers(modifiers);
		const listenerQueue = {};

		for (let {
			groups: { type, action }
		} of settings) {
			if (!Object.keys(types).includes(type)) {
				console.warn(`"${type}" is not a valid TransIt type.\nTransition will not be added.`);
				continue;
			}

			classes.push(type);

			const typeNeedsMod =
				types[type].hasOwnProperty('requiresModifier') &&
				_modifiers.every((mod) => !types[type].requiresModifier.includes(mod));
			if (typeNeedsMod) _modifiers.push(types[type]?.requiresModifier[0]);

			let actions = getActions(action);
			if (!actions) actions = [types[type].defaultAction];
			else excludeRestrictedActions(actions, type);

			actions.forEach((action) => {
				if (!listenerQueue.hasOwnProperty(action)) listenerQueue[action] = [];
				listenerQueue[action].push(type);
			});
		}

		classes = [...classes, ..._modifiers];
		classes.forEach((cls) => el.classList.add(cls));

		const handlers = Object.entries(listenerQueue).reduce(
			(handlers, [eType, transTypes]) => ({
				...handlers,
				...actionsMap[eType](el, transTypes)
			}),
			{}
		);

		Object.entries(handlers).forEach(([eType, handler]) => el.addEventListener(eType, handler));

		return {
			destroy() {
				Object.entries(handlers).forEach(([eType, handler]) =>
					el.removeEventListener(eType, handler)
				);
			}
		};
	}
</script>

<i class={`transit`} use:set={[type, modifier]}>
	<slot />
</i>

<style>
	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = BASE =  */
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.transit {
		position: relative;
		width: var(--transit__width, max-content);
		height: var(--transit__height, min-content);
		margin: var(--transit__margin, 0);
		padding: var(--transit__padding, 0);
		border: var(--transit__border, none);
		border-radius: var(--transit__radius, 0);
		font-style: normal;
		--__color-bg: var(--transit__color-bg, inherit);
		--__color-layer: var(--transit__color-layer, inherit);
		--__color-accent: var(--transit__color-accent, #d9b526);
		--__font-color: var(--transit__font-color, #dddeee);
	}

	.transit > :global(*) {
		position: relative;
		z-index: 2;
	}

	.transit,
	.transit::before,
	.transit::after,
	.transit > :global(*) {
		transition-duration: var(--transit__duration, 0.2s);
		transition-timing-function: var(--transit__easing, linear);
		transition-delay: var(--transit__delay, 0s);
	}

	.transit::before,
	.transit::after {
		position: absolute;
		content: '';
		z-index: 1;
		width: 100%;
		height: 100%;
		border-radius: var(--transit__radius);
	}

	.transit::before {
		background-color: transparent;
	}

	.transit::after {
		background-color: var(--__color-layer);
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END BASE =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = MODIFIERS =  */
	.b-t,
	.b-t::before,
	.b-t::after,
	.t-b,
	.t-b::before,
	.t-b::after {
		--transform-end: translateY(0);
	}

	.b-t,
	.b-t::before,
	.b-t::after {
		--transform-start: translateY(100%);
	}

	.t-b,
	.t-b::before,
	.t-b::after {
		--transform-start: translateY(-100%);
	}

	.l-r,
	.l-r::before,
	.l-r::after,
	.r-l,
	.r-l::before,
	.r-l::after {
		--transform-end: translateX(0);
	}

	.l-r,
	.l-r::before,
	.l-r::after {
		--transform-start: translateX(-100%);
	}

	.r-l,
	.r-l::before,
	.r-l::after {
		--transform-start: translateX(100%);
	}

	.tl-br,
	.tl-br::before,
	.tl-br::after,
	.tr-bl,
	.tr-bl::before,
	.tr-bl::after,
	.bl-tr,
	.bl-tr::before,
	.bl-tr::after,
	.br-tl,
	.br-tl::before,
	.br-tl::after {
		--transform-end: translate(0%, 0%);
	}

	.tl-br,
	.tl-br::before,
	.tl-br::after {
		--transform-start: translate(-100%, -100%);
	}

	.tr-bl,
	.tr-bl::before,
	.tr-bl::after {
		--transform-start: translate(100%, -100%);
	}

	.bl-tr,
	.bl-tr::before,
	.bl-tr::after {
		--transform-start: translate(-100%, 100%);
	}

	.br-tl,
	.br-tl::before,
	.br-tl::after {
		--transform-start: translate(100%, 100%);
	}

	.m-o__hor,
	.m-o__hor::before,
	.m-o__hor::after {
		--transform-start: scaleX(0);
		--transform-end: scaleX(1);
	}

	.m-o__ver,
	.m-o__ver::before,
	.m-o__ver::after {
		--transform-start: scaleY(0);
		--transform-end: scaleY(1);
	}

	.m-o__rad,
	.m-o__rad::before,
	.m-o__rad::after {
		--transform-start: scale(0);
		--transform-end: scale(1);
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END MODIFIERS =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = BORDER FILL =  */
	.border-fill {
		display: flex;
		flex-direction: column;
		place-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.border-fill::before {
		background-color: var(--__color-accent);
		transform-origin: top left;
		transform: var(--transform-start);
		transition-property: transform;
	}

	.border-fill::after {
		width: calc(100% - 0.25em) !important;
		height: calc(100% - 0.25em) !important;
	}

	._border-fill::before {
		transform: var(--transform-end);
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END BORDER FILL =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = FADE =  */
	.fade {
		transition-property: opacity;
		opacity: 0.5;
	}

	.fade::after {
		top: 0;
		left: 0;
	}

	._fade {
		opacity: 1;
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END FADE =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = TEXT COLOR =  */
	.text-color > :global(*) {
		transition-property: color;
		color: var(--transit__color-start, var(--__color-bg));
	}

	.text-color::after {
		top: 0;
		left: 0;
	}

	._text-color > :global(*) {
		color: var(--transit__color-end, var(--__color-accent));
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END TEXT COLOR =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = BG FILL =  */

	.bg-fill {
		overflow: hidden;
	}

	.bg-fill::before {
		top: 0;
		left: 0;
		background-color: var(--__color-layer);
	}

	.bg-fill::after {
		top: 0;
		left: 0;
		background-color: var(--__color-accent);
		/* transform-origin: left; */
		transform: var(--transform-start);
		transition-property: transform;
	}

	._bg-fill::after {
		transform: var(--transform-end);
	}

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = END BG FILL =  */

	/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = UNDERLINE =  */

	.underline {
		overflow: hidden;
	}

	.underline::before,
	.underline::after {
		top: 0;
		left: 0;
	}

	.underline::before {
		background-color: var(--__color-layer);
	}

	.underline::after {
		border-bottom: 0.125em solid var(--__color-accent);
		transition-property: transform;
		transform: var(--transform-start);
	}

	._underline::after {
		transform: var(--transform-end);
	}
</style>
