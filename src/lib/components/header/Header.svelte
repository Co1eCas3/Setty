<script>
	import { page } from '$app/stores';
	import Logo from '$lib/components/header/Logo.svelte';
	import Nav from '$lib/components/header/Nav.svelte';
	import QuickSearch from '$lib/components/header/QuickSearch.svelte';
	import UserOptsNav from '$lib/components/header/UserOptsNav.svelte';
</script>

<header class="flex">
	<Logo />
	<Nav />
	<QuickSearch />
	{#if $page.url.pathname !== '/login'}
		<UserOptsNav />
	{/if}
</header>

<style>
	header {
		width: 100%;
		height: var(--header-height);
		padding: 0 10rem;
		background-color: var(--clr__dk-main);
		color: var(--clr__lt-main);
		gap: var(--size-fluid-3);
	}
</style>
