<script>
	import { user } from '$lib/stores/auth';

	import LoginForm from '$lib/components/header/LoginForm.svelte';
	import LogoutForm from '$lib/components/header/LogoutForm.svelte';
</script>

<div class="auth-cont will-wait">
	{#if $user}
		<LogoutForm />
	{:else}
		<LoginForm on:focus on:blur />
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
