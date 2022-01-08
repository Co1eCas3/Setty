<script>
	import { user } from '$lib/stores/user';
	import { userReady } from '$lib/stores/userReady';

	import LoginForm from '../header/LoginForm.svelte';
	import Loader from '../utilities/Loader.svelte';
	import LogoutForm from './LogoutForm.svelte';
</script>

<div class="auth-cont">
	{#if !$userReady}
		<div class="loader-cont flex">
			<Loader --height="2rem" />
		</div>
	{/if}

	{#if $user}
		<LogoutForm />
	{:else}
		<LoginForm />
	{/if}
</div>

<style>
	.auth-cont {
		position: relative;
		min-height: calc(var(--header-height) / 1.6);
	}

	.loader-cont {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--clr__dk-layer-low);
	}
</style>
