<script>
	import { user } from '$lib/stores/user';

	import AuthorizedPage from '$lib/components/utilities/AuthorizedPage.svelte';
	import UserSideNav from '$lib/components/user/UserSideNav.svelte';
</script>

<AuthorizedPage>
	<header>
		<h1>Hi there{$user.name ? ` ${$user.name}!` : '!'}</h1>
	</header>

	<div class="main-cont">
		<UserSideNav />
		<slot />
	</div>
</AuthorizedPage>

<style>
	header {
		width: 100%;
		height: var(--header-height);
		padding: 0 3rem;
		display: flex;
		place-items: center;
		box-shadow: 0 20px 4px -20px var(--clr__dk-main);
	}

	.main-cont {
		width: 100%;
		display: flex;
	}
</style>
