<script>
	import { goto } from '$app/navigation';

	import { user, userReady } from '$lib/stores/auth';
	import siteMap from '$lib/utils/siteMap';

	import UserSideNav from '$lib/components/user/UserSideNav.svelte';

	$: if ($userReady && !$user) goto(siteMap.login);
</script>

<div id="user-layout" class:wait={!$userReady}>
	<header class="flex">
		<h1 class="will-wait">Hi there{$user?.name ? ` ${$user.name}!` : '!'}</h1>
	</header>
	<UserSideNav />
	<main>
		<slot />
	</main>
</div>

<style>
	#user-layout {
		width: 100%;
		display: grid;
		grid-template:
			'header header' var(--header-height)
			'user-nav body' auto
			/ 25% 75%;
		color: var(--clr__dk-almost);
	}

	header {
		grid-area: header;
		width: 100%;
		height: var(--header-height);
		padding: 0 3rem;
		justify-content: flex-start;
		box-shadow: var(--under-shadow);
	}

	main {
		width: 100%;
		grid-area: body;
		justify-self: start;
		padding: 2rem 5rem;
		overflow-y: scroll;
	}
</style>
