<script>
	import siteMap from '$lib/utils/siteMap';

	export let name;
	export let webSafeName;

	let subMenuOpen;
</script>

<li class="top-level will-wait">
	<div class="flex">
		<a class="transit text-color hover" href={siteMap.band(webSafeName)}>
			<h3>{name}</h3>
		</a>
		<button class="arrow" class:subMenuOpen on:click={() => (subMenuOpen = !subMenuOpen)} />
	</div>

	{#if subMenuOpen}
		<ul class="flex stack">
			<li>
				<a class="transit text-color hover" href={siteMap.repertoire(webSafeName)}>
					<h4>Repertiore</h4>
				</a>
			</li>
			<li>
				<a class="transit text-color hover" href={siteMap.band(webSafeName)}>
					<h4>Set Lists</h4>
				</a>
			</li>
			<li>
				<a class="transit text-color hover" href={siteMap.newList(webSafeName)}>
					<h4>Write a List</h4>
				</a>
			</li>
			<li>
				<a class="transit text-color hover" href={siteMap.bandManage(webSafeName)}>
					<h4>Manage Band</h4>
				</a>
			</li>
		</ul>
	{/if}
</li>

<style>
	.top-level {
		width: 100%;
		margin-right: 2.5rem;
	}

	div {
		justify-content: space-between;
	}

	ul {
		margin: 0.5em 1em;
		place-items: flex-start;
		gap: 0.5em;
	}

	.arrow {
		position: relative;
		bottom: 0.25em;
		width: 1rem;
		height: 1rem;
		display: flex;
		place-items: center;
		transition: bottom 0.2s ease-out;
	}

	.arrow::after {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: 0 auto;
		border: 1px solid var(--clr__dk-layer-low);
		border-top-color: transparent;
		border-right-color: transparent;
		border-bottom-left-radius: 0.25em;
		transform-origin: center;
		transform: rotate(-45deg);
		transition: transform 0.2s ease-out;
	}

	.subMenuOpen {
		bottom: -0.1em;
	}

	.subMenuOpen::after {
		transform: rotate(45deg);
	}
</style>
