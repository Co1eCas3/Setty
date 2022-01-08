<script>
	import * as siteMap from '../../utils/siteMap';

	export let name;
	export let webSafeName;

	let subMenuOpen;
</script>

<li>
	<div class="flex">
		<a href={siteMap.band(webSafeName)}>
			<h3>{name}</h3>
		</a>
		<button class="arrow" class:subMenuOpen on:click={() => (subMenuOpen = !subMenuOpen)} />
	</div>

	{#if subMenuOpen}
		<ul class="flex stack">
			<li>
				<a href={siteMap.repertoire(webSafeName)}>
					<h5>Repertiore</h5>
				</a>
			</li>
			<li>
				<a href={siteMap.band(webSafeName)}>
					<h5>Set Lists</h5>
				</a>
			</li>
			<li>
				<a href={siteMap.newList(webSafeName)}>
					<h5>Write a List</h5>
				</a>
			</li>
			<li>
				<a href={siteMap.bandManage(webSafeName)}>
					<h5>Manage Band</h5>
				</a>
			</li>
		</ul>
	{/if}
</li>

<style>
	.arrow {
		position: relative;
		width: 2rem;
		height: 2rem;
		display: flex;
		place-items: center;
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
		border-bottom-left-radius: 1rem;
		transform-origin: center;
		transform: rotate(-45deg);
		transition: transform 0.2s ease-out;
	}

	.subMenuOpen::after {
		transform: rotate(45deg);
	}
</style>
