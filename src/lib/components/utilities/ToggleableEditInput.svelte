<script>
	import { onDestroy, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/env';

	import WaitForIt from '$lib/components/utilities/WaitForIt.svelte';
	import Loader from '$lib/components/utilities/Loader.svelte';

	export let target = 'input';
	export let submitFn = () => finish();
	export let validationErr;
	let editing = false,
		submitErr = false,
		saved = false,
		notSaved = false,
		contEl,
		initValue,
		waiter;

	$: targetEl = contEl?.querySelector(target);
	$: if (targetEl) targetEl.disabled = !editing;
	$: if (targetEl) targetEl.classList.add('edit-toggle-target');

	$: initValue = initValue ?? targetEl?.value;
	$: value = initValue;
	$: notSaved = value !== initValue;

	const inputHandler = () => (value = targetEl.value);

	async function startEdit() {
		editing = true;
		// disabled isn't removed til after update
		await tick();
		targetEl.focus();
		targetEl.select();
		targetEl.addEventListener('input', inputHandler);
	}

	function resetToInitValue() {
		targetEl.value = value = initValue;
		targetEl.focus();
		targetEl.select();
	}

	function cancelEdit() {
		targetEl.removeEventListener('input', inputHandler);
		editing = false;
	}

	async function initSubmit(e) {
		const res = await submitFn(value);
		submitErr = !res;
		if (!res) return;
		finish();
	}

	function finish() {
		initValue = value;
		saved = true;
		const timer = setTimeout(() => {
			clearTimeout(timer);
			saved = false;
		}, 2500);
		editing = false;
	}

	onDestroy(() => browser && targetEl.removeEventListener('input', inputHandler));
</script>

<div
	class="edit-toggle-cont flex"
	class:editing
	class:saved
	class:notSaved
	class:submitErr
	bind:this={contEl}
>
	<slot />

	{#if editing}
		{#if initValue !== value}
			<WaitForIt bind:this={waiter}>
				<Loader slot="loader" --height="1.7em" />
				<button
					slot="content"
					class="icon-cont"
					disabled={validationErr}
					data-icon="Confirm"
					on:click={waiter.prep(initSubmit)}
					transition:fly={{ x: 100, duration: 250 }}
				>
					<div class="icono-check" />
				</button>
			</WaitForIt>

			<button
				class="icon-cont"
				data-icon="Reset"
				on:click={resetToInitValue}
				transition:fly={{ x: 100, duration: 250, delay: 100 }}
			>
				<div class="icono-reset" />
			</button>
		{/if}

		<button class="icon-cont" data-icon="Cancel" on:click={cancelEdit}>
			<div class="icono-cross" />
		</button>
	{:else}
		<button class="icon-cont" data-icon="Edit" on:click={startEdit}>
			<div class="icono-rename" />
		</button>
	{/if}
</div>

<style>
	.edit-toggle-cont {
		position: relative;
		width: 100%;
		justify-content: flex-start;
		gap: 0.5em;
	}

	.edit-toggle-cont::after {
		bottom: 0;
		left: 0;
		font-size: 0.7em;
		opacity: 0;
		transition: bottom, opacity;
	}

	.saved::after,
	.notSaved::after,
	.submitErr::after {
		bottom: 100%;
		opacity: 1;
	}

	.saved::after {
		content: 'Saved!';
		color: var(--clr__success);
	}

	.notSaved::after,
	.submitErr::after {
		color: var(--clr__error);
	}

	.notSaved::after {
		content: 'Not Saved!';
	}

	.submitErr::after {
		content: 'Error!';
	}

	.edit-toggle-cont > :global(*:first-child) {
		flex-grow: 0;
		width: max-content;
		transition: flex-grow 0.2s ease-out;
	}

	.edit-toggle-cont.editing > :global(*:first-child) {
		flex-grow: 1;
	}

	.edit-toggle-cont :global(.edit-toggle-target:disabled) {
		width: min-content;
		border: none;
		background-color: transparent;
	}

	.edit-toggle-cont.editing :global(.edit-toggle-target) {
		border-width: 0.125em;
		border-style: solid;
		border-color: transparent;
		background: var(--clr__dk-layer-low);
		color: var(--clr__lt-main);
	}

	.edit-toggle-cont.editing :global(.edit-toggle-target:focus),
	.edit-toggle-cont.editing :global(.edit-toggle-target:focus-within) {
		transition-property: box-shadow, transform;
		transition-duration: 0.2s;
	}

	.edit-toggle-cont :global(.edit-toggle-target:focus),
	.edit-toggle-cont :global(.edit-toggle-target:focus-within) {
		border-color: var(--clr__accent);
		box-shadow: 3px 3px 6px var(--clr__dk-half);
		transform: scale(1.03);
	}

	.icon-cont {
		position: relative;
		top: -0.3em;
		width: 1.7em;
		aspect-ratio: 1;
		padding: 0;
	}

	.icon-cont::after {
		content: attr(data-icon);
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		font-size: 0.7em;
		opacity: 0;
		transition-property: bottom, opacity;
		transition-duration: 0.1s;
	}

	[class*='icono-'] {
		position: relative;
		color: var(--clr__dk-half);
		transition: color 0.1s;
	}

	.icon-cont:not(:disabled):hover::after {
		opacity: 1;
		bottom: 100%;
	}

	.icon-cont:not(:disabled):hover [class*='icono-'] {
		color: var(--clr__dk-main);
	}
</style>
