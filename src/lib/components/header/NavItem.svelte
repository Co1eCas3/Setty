<script>
	export let title;
	export let href;
	export let next = null;

	let subMenuOpen = false;

	function toggleSubMenu(node) {
		node.addEventListener('mouseover', openSubMenu);

		function openSubMenu() {
			subMenuOpen = true;
			node.removeEventListener('mouseover', openSubMenu);
			node.addEventListener('mouseleave', closeSubMenu);
		}

		function closeSubMenu() {
			subMenuOpen = false;
			node.removeEventListener('mouseleave', closeSubMenu);
			node.addEventListener('mouseover', openSubMenu);
		}
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<li class="top-level flex trans underline text__dim-bright" use:toggleSubMenu>
	<a {href}>{title}</a>
	{#if subMenuOpen && next}
		<ul class="flex stack">
			{#each next as subLink}
				{#if subLink.show}
					<li class="flex trans underline text__dim-bright">
						<a href={subLink.href}>{subLink.title}</a>
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
		height: 100%;
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
	}

	ul > li {
		min-width: 13ch;
		min-height: calc(var(--header-height) / 1.6);
	}
</style>
