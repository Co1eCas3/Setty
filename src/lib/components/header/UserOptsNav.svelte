<script>
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import { urlMaker } from '$lib/utils/helpers';

	import Auth from './Auth.svelte';

	let menuOpen = false;
	$: includeProfile = !!$user && !!$page.params.band;
</script>

<nav>
	<div class="icon-cont" on:click={() => (menuOpen = !menuOpen)}>
		<div class="icono-user" />
	</div>
	{#if menuOpen}
		<ul>
			{#if includeProfile}
				<li>
					<a href={urlMaker({ path: '/user' })}>Profile</a>
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

	/* .icono-user {
		background-color: var(--txt__lt-dim);
		border-radius: 50%;
	} */

	.icono-user::before {
		width: 17px;
		height: 17px;
	}

	ul {
		position: absolute;
		top: 100%;
		right: -1rem;
		width: max-content;
		background-color: var(--clr__dk-main);
		box-shadow: 0 1px 6px var(--txt__lt-half);
		font-size: 1.5rem;
	}

	li {
		position: relative;
		min-width: 15ch;
		min-height: calc(var(--header-height) / 1.6);
		margin: 0 1.5rem;
		border-bottom: 1px solid var(--txt__lt-half);
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
		color: var(--txt__lt-main);
	}

	a {
		flex-basis: 100%;
		color: var(--txt__lt-half);
		transition: color 0.1s linear;
	}
</style>
