<script>
	import TransIt from '../utilities/TransIt.svelte';

	export let title;
	export let href;
	export let next = null;

	console.log(title, next);

	let subMenuOpen = true;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<li
	class="top-level flex"
	on:mouseover={() => (subMenuOpen = true)}
	on:mouseleave={() => (subMenuOpen = false)}
>
	<a {href}>{title}</a>
	{#if subMenuOpen && next}
		<ul class="flex stack">
			{#each next as subLink}
				{#if subLink.show}
					<TransIt
						type="underline text-color"
						modifier="m-o__hor"
						--transit__color-start="var(--clr__lt-half)"
						--transit__color-end="var(--clr__lt-main)"
					>
						<li class="flex">
							<a href={subLink.href}>{subLink.title}</a>
						</li>
					</TransIt>
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

	.top-level::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-bottom: 0.125em solid var(--clr__accent);
		transform-origin: center;
		transform: scaleX(0);
		transition: transform 0.2s linear 0s;
	}

	.top-level:hover {
		color: inherit;
	}

	.top-level:hover::after {
		transform: scaleX(1);
	}

	/* .flex {
		height: 100%;
		justify-content: flex-start;
		transition: color 0.1s linear;
	} */

	ul {
		position: absolute;
		top: 100%;
		right: -1rem;
		width: max-content;
		padding: 0 3rem 0 1rem;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--clr__lt-half);
		place-items: flex-start;
		gap: 0;
	}

	ul li {
		min-width: 13ch;
		min-height: calc(var(--header-height) / 1.6);
		justify-content: flex-start;
	}
</style>
