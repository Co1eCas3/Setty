<script>
	import { user } from '$lib/stores/auth';
	import * as validate from '$lib/utils/validate';

	import NewUserForm from '$lib/components/user/NewUserForm.svelte';
	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';
	import ToggleableEditInput from '$lib/components/utilities/ToggleableEditInput.svelte';

	let hash, isErred;

	// TODO: get hash to init NewUserForm
	// onMount(() => (hash = window.location.hash));
</script>

<h1>Details</h1>

<form class="flex stack" on:submit|preventDefault>
	<!-- TODO -->
	<!-- enable ability to submit individual inputs -->

	<ToggleableEditInput submitFn={user.updateUserName} validationErr={isErred}>
		<ValidatedInput
			type="text"
			placeholder="Add your name"
			value={$user.name}
			validation={validate.name}
			bind:isErred
		/>
	</ToggleableEditInput>

	<b>{$user.email}</b>
</form>

{#if !!hash}
	<NewUserForm />
{/if}

<style>
	h1 {
		width: 100%;
		margin-bottom: 3rem;
		box-shadow: var(--under-shadow);
	}

	form {
		width: 60ch;
		margin-left: 4rem;
		place-items: flex-start;
		font-size: var(--font-size-3);
	}

	b {
		padding: 0.35rem 0.8rem;
		font-weight: 400;
	}
</style>
