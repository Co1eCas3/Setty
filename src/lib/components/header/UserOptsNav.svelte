<script>
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import * as siteMap from '$lib/utils/siteMap';

	import Auth from './Auth.svelte';

	let menuOpen = false;
	$: includeProfile = !!$user && !!$page.params.band;

	function handleOpenMenu() {
		if (menuOpen) return handleCloseMenu();
		menuOpen = true;
		document.body.addEventListener('click', handleCloseMenu);
	}

	function handleCloseMenu() {
		menuOpen = false;
		document.body.removeEventListener('click', handleCloseMenu);
	}
</script>

<nav>
	<!-- this click needs to be prevented from bubbling because -->
	<!-- it adds a click listener to the body. w/out preventing -->
	<!-- propapation, the click would be fired again once the event -->
	<!-- reached the body, and would set off handleMenuClose -->
	<!-- effect would be complete inability to open the menu -->
	<div on:click|stopPropagation={handleOpenMenu} class="icon-cont flex stack round" class:menuOpen>
		<div class="icono-user" />
	</div>

	{#if menuOpen}
		<!-- empty click handler with stopPropagation in order to -->
		<!-- prevent a click event in the menu from triggering close -->
		<!-- handler attached to the body -->
		<ul on:click|stopPropagation={() => null}>
			{#if includeProfile}
				<li class="flex">
					<a href={siteMap.userProfile}>Profile</a>
				</li>
			{/if}
			<li>
				<Auth />
			</li>
		</ul>
	{/if}
</nav>

<style>
	nav {
		position: relative;
		height: 100%;
		display: flex;
		place-items: center;
	}

	ul {
		position: absolute;
		top: 100%;
		z-index: 9999;
		right: -1rem;
		width: max-content;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--clr__lt-half);
		font-size: 1.5rem;
	}

	li {
		position: relative;
		width: 100%;
		min-width: 15ch;
		min-height: calc(var(--header-height) / 1.6);
		border-bottom: 0.125rem solid var(--clr__lt-half);
		justify-content: flex-start;
	}

	li::after {
		left: 0;
		right: 0;
		bottom: 0;
		width: 0;
		height: 3px;
		margin: 0 auto;
		background-color: var(--clr__accent);
		transition: width 0.2s ease-out;
	}

	li:hover:not(:last-child)::after {
		width: 100%;
	}

	li:hover a {
		color: var(--clr__lt-main);
	}

	a {
		flex-basis: 100%;
		color: var(--clr__lt-half);
		transition: color 0.1s linear;
	}

	.icon-cont {
		position: relative;
		width: 3.5rem;
		aspect-ratio: 1;
		color: var(--clr__lt-half);
		justify-content: center;
		overflow: hidden;
		transition: color 0.2s ease-out;
		cursor: pointer;
	}

	.icon-cont::before,
	.icon-cont::after {
		width: 100%;
		height: 100%;
		margin: auto;
	}

	.icon-cont::before {
		background: var(--clr__accent);
		transform-origin: top;
		transform: translateY(100%);
		transition: transform 0.2s ease-out;
	}

	.icon-cont::after {
		width: calc(100% - 0.125em);
		height: calc(100% - 0.125em);
		background: var(--clr__dk-layer-low);
	}

	.icon-cont:hover,
	.menuOpen {
		color: var(--clr__lt-main);
	}

	.menuOpen::before {
		transform: translateY(0);
	}

	[class^='icono'] {
		z-index: 2;
		color: inherit;
	}

	.icono-user::before {
		width: 16px;
		height: 16px;
	}
</style>
