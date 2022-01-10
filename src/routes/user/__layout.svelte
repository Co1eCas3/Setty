<script>
	import { goto } from '$app/navigation';

	import { user } from '$lib/stores/auth';
	import { userReady } from '$lib/stores/auth';
	import * as siteMap from '$lib/utils/siteMap';

	import Loader from '$lib/components/utilities/Loader.svelte';
	import UserSideNav from '$lib/components/user/UserSideNav.svelte';
	import WaitForIt from '$lib/components/utilities/WaitForIt.svelte';

	$: if ($userReady && !$user) {
		console.log('routing');
		goto(siteMap.login);
	}
</script>

<!-- {#if !$userReady} -->

<WaitForIt waitOn={$userReady}>
	<div slot="loader" class="loader-cont flex">
		<Loader --color="var(--clr__dk-main)" />
	</div>
	<!-- {:else if $user} -->
	<svelte:fragment slot="content">
		<div id="user-layout">
			<header class="flex">
				<h1>Hi there{$user.name ? ` ${$user.name}!` : '!'}</h1>
			</header>
			<UserSideNav />
			<main>
				<slot />
			</main>
		</div>
	</svelte:fragment>
</WaitForIt>

<!-- {/if} -->
<style>
	.loader-cont {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}

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
	}
</style>
