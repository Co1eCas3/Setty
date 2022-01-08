<script>
	import { userReady } from '../../stores/userReady';
	import { user } from '../../stores/user';

	export let requires;

	if (requires === undefined || requires === null)
		throw new Error("AuthOnlyComponent must has 'requires' property");

	$: isPermitted = $userReady && $user.userRole >= requires;
</script>

{#if isPermitted}
	<slot />
{/if}
