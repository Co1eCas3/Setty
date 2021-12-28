<script>
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';
	import Nav from './Nav.svelte';
	import QuickSearch from './QuickSearch.svelte';
	import UserOptsNav from './UserOptsNav.svelte';
</script>

<header>
	<Logo />
	<Nav />
	<QuickSearch />
	{#if $page.path !== '/login'}
		<UserOptsNav />
	{/if}
</header>

<style>
	header {
		width: 100%;
		height: var(--header-height);
		padding: 0 10rem;
		border-bottom: 1px solid var(--txt__lt-main);
		background-color: var(--clr__dk-main);
		color: var(--txt__lt-main);
		display: flex;
		gap: 2rem;
		place-items: center;
	}
</style>
