<script>
	export let cancelCb = null;
</script>

<section>
	<div class="cont">
		{#if cancelCb}
			<div class="cancel" on:click={cancelCb}>X</div>
		{/if}
		<slot />
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		width: 100vw;
		height: 100vh;
		background-color: var(--clr__dk-almost);
	}

	.cont {
		position: fixed;
		top: calc(var(--header-height) * 0.8);
		left: 0;
		right: 0;
		height: 80vh;
		width: 80vw;
		margin: 0 auto;
		/* padding-top: 4rem; */
		border-radius: 12px;
		background-color: var(--clr__dk-main);
		box-shadow: 0 0 6px var(--clr__dk-main), 0 0 6px var(--clr__lt-main);
		color: var(--clr__lt-main);
		font-size: 1.5rem;
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 2rem;
	}

	.cancel {
		position: absolute;
		top: 1em;
		right: 1em;
		width: 2em;
		aspect-ratio: 1;
		background-color: var(--clr__lt-dim);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		place-items: center;
	}
</style>
