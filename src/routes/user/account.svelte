<script>
	import { onMount } from 'svelte';

	import { user } from '$lib/stores/user';
	import * as validate from '$lib/utils/validate';

	import NewUserForm from '$lib/components/user/NewUserForm.svelte';
	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';

	let hash, nameErr, emailErr;

	// TODO: get hash to init NewUserForm
	// onMount(() => (hash = window.location.hash));
</script>

<main>
	<h1>User Account</h1>

	<form>
		<!-- TODO -->
		<!-- enable ability to submit individual inputs -->
		<ValidatedInput
			type="text"
			placeholder="Add your name"
			bind:value={$user.name}
			validateFn={validate.name}
			bind:isErred={nameErr}
		/>
		<ValidatedInput
			type="email"
			bind:value={$user.email}
			validationFn={validate.email}
			bind:isErred={emailErr}
		/>
	</form>

	{#if !!hash}
		<NewUserForm />
	{/if}
</main>
