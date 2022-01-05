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
	<div
		on:click|stopPropagation={handleOpenMenu}
		class="icon-cont flex stack round trans text__dim-bright"
	>
		<div class={'icono-user'} />
	</div>

	{#if menuOpen}
		<!-- empty click handler with stopPropagation in order to -->
		<!-- prevent a click event in the menu from triggering close -->
		<!-- handler attached to the body -->
		<ul on:click|stopPropagation={() => null}>
			{#if includeProfile}
				<li>
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
		cursor: pointer;
	}

	nav:hover > .border-fill::before {
		transform: translateY(0);
	}

	ul {
		position: absolute;
		top: 100%;
		right: -1rem;
		width: max-content;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--clr__lt-half);
		font-size: 1.5rem;
	}

	li {
		position: relative;
		min-width: 15ch;
		min-height: calc(var(--header-height) / 1.6);
		margin: 0 1.5rem;
		border-bottom: 1px solid var(--clr__lt-half);
		display: flex;
		place-items: center;
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
		overflow: hidden;
		justify-content: center;
	}

	[class^='icono'] {
		z-index: 2;
	}

	.icono-user::before {
		width: 16px;
		height: 16px;
	}
</style>
