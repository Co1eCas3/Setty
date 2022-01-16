<script>
	import { onMount } from 'svelte';

	export let selectedValue;
	export let editValue = false;
	export let customValue = '';

	let inputEl, selectEl, editOptionHandler, focusHandler, blurHandler;

	onMount(() => {
		const doSelect = [...selectEl.querySelectorAll('option')].findIndex(
			(opt) => opt.value == selectedValue
		);
		selectEl.selectedIndex = doSelect > -1 ? doSelect : 0;

		selectChangedHandler();

		return () => {
			inputEl.removeEventListener('input', editOptionHandler);
			inputEl.removeEventListener('focus', focusHandler);
			inputEl.removeEventListener('blur', blurHandler);
		};
	});

	function selectChangedHandler() {
		const selected = selectEl.selectedOptions[0];
		selectedValue = selected.value;
		inputEl.value = selected.textContent;
		inputEl.disabled = selected.contentEditable !== 'true';

		editOptionHandler = () => editOptionEl(selected);
		focusHandler = () => inputEl.select();
		blurHandler = () => {
			inputEl.value = inputEl.value || 'Other';
			editOptionEl(selected);
		};

		if (!inputEl.disabled) {
			inputEl.addEventListener('input', editOptionHandler);
			inputEl.addEventListener('focus', focusHandler);
			inputEl.addEventListener('blur', blurHandler);
		} else {
			inputEl.removeEventListener('input', editOptionHandler);
			inputEl.removeEventListener('focus', focusHandler);
			inputEl.removeEventListener('blur', blurHandler);
		}
	}

	function editOptionEl(selected) {
		customValue = inputEl.value;
		selected.textContent = inputEl.value;
		if (editValue) selectedValue = selected.value = customValue;
	}
</script>

<div class="cont__main" on:click>
	<select bind:this={selectEl} on:change={selectChangedHandler}>
		<slot />
	</select>
	<input type="text" bind:this={inputEl} />
	<i on:click={() => inputEl.focus()} />
</div>

<style>
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.cont__main {
		position: relative;
		z-index: 1;
		/* width: 100%; */
		margin: 0 auto;
	}

	.cont__main::after {
		top: 0;
		right: 0;
		z-index: -1;
		margin-block: auto;
		height: 50%;
		aspect-ratio: 1;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		border-bottom-right-radius: 0.15em;
		transform: rotate(45deg);
	}

	select {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 2rem;
		border: none;
		opacity: 0;
	}

	select:focus,
	select:active {
		outline: none;
	}

	input {
		position: relative;
		z-index: 3;
		width: calc(100% - 28px);
		height: 2rem;
		color: inherit;
	}

	/* input:disabled {
		color: black;
	} */

	i {
		position: absolute;
		top: 0;
		right: 30px;
		z-index: 3;
		height: 100%;
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		place-items: center;
		transform: rotate(40deg);
		opacity: 0;
		transition: opacity 0.1s linear;
	}

	/* 	input:disabled ~ i { opacity: 0; } */
	input:not(:disabled) ~ i {
		opacity: 1;
	}

	input:not(:disabled) ~ i::before,
	input:not(:disabled) ~ i::after {
		content: '';
		position: absolute;
		width: 0;
		border-style: solid;
	}

	input:not(:disabled) ~ i::before {
		height: 60%;
		border-width: 0 3px;
		border-color: var(--clr__lt-half);
		border-radius: 4px 4px 0 0;
	}

	input:not(:disabled) ~ i::after {
		height: 0;
		top: 80%;
		border-width: 6px 3px 0;
		border-color: var(--clr__lt-half) transparent transparent transparent;
		border-style: solid;
	}
</style>
