<script>
	import { afterUpdate, tick } from 'svelte';
	import { browser } from '$app/env';
	import { page } from '$app/stores';

	import { user, userReady } from '$lib/stores/auth';
	import siteMap from '$lib/utils/siteMap';

	import Auth from '$lib/components/header/Auth.svelte';

	let menuOpen = false,
		emailInpFocused = false;
	$: includeProfile = !!$user && !!$page.params.band;

	$: if (emailInpFocused) document.body.addEventListener('click', handleClickClose);

	function handleClickClose() {
		menuOpen = false;
		document.body.removeEventListener('click', handleClickClose);
	}
</script>

<nav
	on:mouseenter={() => (menuOpen = true)}
	on:mouseleave={emailInpFocused ? null : () => (menuOpen = false)}
>
	<!-- this click needs to be prevented from bubbling because -->
	<!-- it adds a click listener to the body. w/out preventing -->
	<!-- propapation, the click would be fired again once the event -->
	<!-- reached the body, and would set off handleMenuClose -->
	<!-- effect would be complete inability to open the menu -->
	<div
		on:click={emailInpFocused ? handleClickClose : () => null}
		class="icon-cont flex stack round"
		class:menuOpen
	>
		<div class="icono-user" />
	</div>

	{#if menuOpen}
		<!-- empty click handler with stopPropagation in order to -->
		<!-- prevent a click event in the menu from triggering close -->
		<!-- handler attached to the body -->
		<ul>
			{#if includeProfile}
				<li class="flex">
					<a class="flex transit underline text-color hover m-o__hor" href={siteMap.userProfile}
						>Profile</a
					>
				</li>
			{/if}
			<li class:wait={!$userReady} on:click|stopPropagation={() => null}>
				<Auth on:focus={() => (emailInpFocused = true)} on:blur={() => (emailInpFocused = false)} />
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
		height: calc(var(--header-height) / 1.6);
		padding: 0 2rem;
		place-items: flex-start;
	}

	a {
		width: 100%;
		height: 100%;
		justify-content: flex-start;
		--text-start: var(--clr__lt-half);
		--text-end: var(--clr__lt-main);
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
