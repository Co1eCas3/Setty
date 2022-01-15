<script>
	import * as validator from 'validator';
	const { isEmpty } = validator.default;

	export let type = 'text';
	export let value = '';
	export let transform = (newVal) => newVal;
	export let validation = () => '';
	export let showErrOnBlur = false;
	export let isErred;

	let showError = !showErrOnBlur;

	$: validationMessage = validation(value);
	$: isErred = !isEmpty(validationMessage);

	function handle(inp) {
		inp.value = value;
		const handleValue = ({ target }) => (target.value = value = transform(target.value));
		const handleDoValidate = () => {
			showError = true;
			inp.removeEventListener('blur', handleDoValidate);
		};

		inp.addEventListener('input', handleValue);
		if (showErrOnBlur) inp.addEventListener('blur', handleDoValidate);

		return {
			destroy() {
				inp.removeEventListener('input', handleValue);
				inp.removeEventListener('blur', handleDoValidate);
			}
		};
	}
</script>

<div class={$$restProps.class}>
	<input {...$$restProps} {type} use:handle on:focus on:blur />
	<small>{showError ? validationMessage : ''}</small>
</div>

<style>
	div {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: inherit;
		place-items: inherit;
	}

	input {
		width: 100%;
		font-size: inherit;
		letter-spacing: inherit;
		margin-bottom: 1.5em;
	}

	small {
		position: absolute;
		bottom: 0.4em;
		left: 0;
		font-size: 0.6em;
		line-height: 100%;
		display: inline-block;
		color: red;
	}
</style>
