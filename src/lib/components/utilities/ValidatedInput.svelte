<script>
	import isEmpty from 'validator/lib/isEmpty';

	export let type = 'text';
	export let placeholder = '';
	export let value = '';
	export let valueFn = (newVal) => newVal;
	export let validationFn = () => '';
	export let validateOn = 'input';
	export let isErred;

	let el,
		doValidate = false;

	$: validationMessage = validationFn(value, el);
	$: isErred = doValidate && !isEmpty(validationMessage);

	function validateOnHandler(inp, _value) {
		inp.value = _value;

		let multipleOns = Array.isArray(validateOn),
			curOnInd = 0,
			doValidateHandler;

		const updateValue = () => (value = inp.value = valueFn(inp.value));
		inp.addEventListener('input', updateValue);

		if (multipleOns) {
			doValidateHandler = () => {
				doValidate = true;

				if (validateOn[curOnInd + 1]) {
					inp.removeEventListener(validateOn[curOnInd], doValidateHandler);
					inp.addEventListener(validateOn[++curOnInd], doValidateHandler);
				}
			};

			inp.addEventListener(validateOn[0], doValidateHandler);
		} else {
			doValidateHandler = updateValue;
			inp.addEventListener(validateOn, doValidateHandler);
		}

		return {
			update(_value) {
				inp.value = value;
			},
			destroy() {
				inp.removeEventListener('input', updateValue);
				inp.removeEventListener(multipleOns ? validateOn[curOnInd] : validateOn, doValidateHandler);
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
		font-size: inherit;
	}

	input {
		background-color: inherit;
		border: inherit;
	}

	small {
		display: inline-block;
		height: max(0.7em, 0.7rem);
		font-size: max(0.7em, 0.7rem);
	}
</style>
