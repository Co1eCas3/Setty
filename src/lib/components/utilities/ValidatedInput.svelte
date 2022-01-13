<script>
	import * as validator from 'validator';
	const { isEmpty } = validator.default;

	export let value = '';
	export let transform = (newVal) => newVal;
	export let validation = () => '';
	export let waitForBlur = false;
	export let isErred;

	let doValidate = false;

	$: validationMessage = validation(value);
	$: isErred = doValidate && !isEmpty(validationMessage);

	function handle(inp) {
		const handleValue = ({ target }) => (target.value = value = transform(target.value));
		const handleDoValidate = () => {
			console.log('blurred');
			doValidate = true;
			inp.removeEventListener('blur', handleDoValidate);
		};

		inp.addEventListener('input', handleValue);
		if (waitForBlur) inp.addEventListener('blur', handleDoValidate);

		return {
			destroy() {
				inp.removeEventListener('input', handleValue);
				if (waitForBlur) inp.removeEventListener('blur', handleDoValidate);
			}
		};
	}
</script>

<div>
	<input {...$$restProps} use:handle />
	<small>{doValidate ? validationMessage : ''}</small>
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
		font-size: inherit;
		letter-spacing: inherit;
		margin-bottom: 1em;
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
