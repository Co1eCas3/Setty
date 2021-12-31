<script>
	import isEmpty from 'validator/lib/isEmpty';

	export let type = 'text';
	export let placeholder = '';
	export let value = '';
	export let valueFn = (newVal) => newVal;
	export let validationFn = () => '';
	export let validateOn = 'input';
	export let isErred;

	let el;

	$: validationMessage = validationFn(value, el);
	$: isErred = !isEmpty(validationMessage);

	function validateOnHandler(inp, _value) {
		inp.value = _value;

		let multipleOns = Array.isArray(validateOn),
			curOnInd = 0,
			handler;

		const updateValue = () => (value = inp.value = valueFn(inp.value));

		if (multipleOns) {
			handler = () => {
				updateValue();

				if (validateOn[curOnInd + 1]) {
					inp.removeEventListener(validateOn[curOnInd], handler);
					inp.addEventListener(validateOn[++curOnInd], handler);
				}
			};

			inp.addEventListener(validateOn[0], handler);
		} else {
			handler = updateValue;
			inp.addEventListener(validateOn, handler);
		}

		return {
			update(_value) {
				inp.value = value;
			},
			destroy() {
				inp.removeEventListener(multipleOns ? validateOn[curOnInd] : validateOn, handler);
			}
		};
	}
</script>

<div>
	<input {type} {placeholder} use:validateOnHandler={value} bind:this={el} />
	<small>{validationMessage}</small>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
	}

	input {
		font-size: inherit;
		background-color: var(--clr__dk-layer-low);
	}

	small {
		display: inline-block;
		height: max(0.7em, 0.7rem);
		font-size: max(0.7em, 0.7rem);
	}
</style>
