<script>
	import { firebase, user, userReady } from '$lib/stores/auth';

	import WaitForIt from '$lib/components/utilities/WaitForIt.svelte';
	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';

	let waiter;
</script>

<main>
	<h3 />

	<form>
		<ValidatedInput />
		<button type="submit" />
	</form>
</main>
