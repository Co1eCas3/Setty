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
<li class="top-level" use:toggleSubMenu>
	<a {href}>{title}</a>
	{#if subMenuOpen && next}
		<ul>
			{#each next as subLink}
				{#if subLink.show}
					<li>
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
		display: flex;
		place-content: center;
	}

	li::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 0;
		height: 3px;
		margin: 0 auto;
		background-color: var(--clr__accent);
		transition: width 0.2s ease-out;
	}

	li:hover::after {
		width: 100%;
	}

	a {
		height: 100%;
		display: flex;
		place-items: center;
		color: var(--txt__lt-half);
		transition: color 0.1s linear;
	}

	li:hover a {
		color: var(--txt__lt-main);
	}

	ul {
		position: absolute;
		top: 100%;
		right: -1rem;
		width: max-content;
		padding: 0 3rem 0 1rem;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--txt__lt-half);
		display: flex;
		flex-direction: column;
		place-items: center;
	}

	ul > li {
		min-width: 13ch;
		height: calc(var(--header-height) / 1.6);
	}

	.isCurPage {
		color: var(--txt__lt-main);
	}
</style>
