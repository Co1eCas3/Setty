<script>
	import { userReady } from '$lib/stores/auth';
	import { user } from '$lib/stores/auth';

	export let requires;

	if (requires === undefined || requires === null)
		throw new Error("AuthOnlyComponent must has 'requires' property");

	$: isPermitted = $userReady && $user.userRole >= requires;
</script>

{#if isPermitted}
	<slot />
{/if}
