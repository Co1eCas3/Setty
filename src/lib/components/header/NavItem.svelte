<script>
	export let title;
	export let href;
	export let next = null;

	let subMenuOpen = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<li
	class="top-level flex"
	on:mouseover={() => (subMenuOpen = true)}
	on:mouseleave={() => (subMenuOpen = false)}
>
	<a class="flex transit underline text-color hover m-o__hor" {href}>{title}</a>
	{#if subMenuOpen && next}
		<ul class="flex stack">
			{#each next as subLink}
				{#if subLink.show}
					<li class="sub-item flex">
						<a class="flex transit underline text-color hover m-o__hor" href={subLink.href}
							>{subLink.title}</a
						>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</li>

<style>
	.top-level {
		position: relative;
		width: max-content;
		height: var(--header-height);
		color: var(--clr__lt-half);
		transition: color 0.2s linear 0s;
	}

	ul {
		position: absolute;
		z-index: 9999;
		top: 100%;
		right: -1rem;
		width: max-content;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--clr__lt-half);
		place-items: flex-start;
		gap: 0;
	}

	.sub-item {
		position: relative;
		width: 100%;
		min-width: 13ch;
		height: calc(var(--header-height) / 1.6);
		padding: 0 3rem;
		justify-content: flex-start;
	}

	a {
		position: relative;
		width: 100%;
		height: 100%;
		--text-start: var(--clr__lt-half);
		--text-end: var(--clr__lt-main);
	}
</style>
