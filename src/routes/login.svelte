<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import isEmpty from 'validator/lib/isEmpty';

	import { firebase, user, userReady } from '$lib/stores/auth';
	import * as validate from '$lib/utils/validate';
	import * as siteMap from '$lib/utils/siteMap';

	import WaitForIt from '$lib/components/utilities/WaitForIt.svelte';
	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';
	import Loader from '$lib/components/utilities/Loader.svelte';

	// $: if ($user) {
	// 	if (!$user.name) goto(siteMap.newUser);
	// 	else if ($user.bands.length === 1) goto(siteMap.band($user.bands[0].band.webSafeName));
	// 	else goto(siteMap.userBands);
	// }

	let waiter,
		email,
		emailErr = false,
		submitErr = false,
		submitSuccess = false,
		headerMessage = 'Password-less login!';

	const submitActions = ['sendEmail', 'signIn'];
	const successMessages = ['Link is on the way!', 'Welcome!'];
	const btnTexts = ['GET LINK', 'SIGN IN'];

	$: {
		if (submitErr) headerMessage = 'Oops! Ran into an error.. Try again?';
		else if (submitSuccess) headerMessage = successMessages[+$firebase.needEmailAgain];
		else if ($firebase.needEmailAgain)
			headerMessage = 'Please enter your email to complete signin.';
	}

	async function submitAction() {
		submitSuccess = await firebase[submitActions[+$firebase.needEmailAgain]](email);
		submitErr = !submitSuccess;
	}

	onMount(() => firebase.signIn());
</script>

<main class="flex stack">
	<WaitForIt waitOn={$userReady}>
		<Loader slot="loader" />
		<svelte:fragment slot="content">
			<h3>{headerMessage}</h3>

			<form class="flex stack" on:submit|preventDefault={waiter.prep(submitAction)}>
				<WaitForIt bind:this={waiter}>
					<Loader slot="loader" />

					<svelte:fragment slot="content">
						<ValidatedInput
							type="email"
							placeholder="you@email.com"
							bind:value={email}
							validationFn={validate.email}
							bind:isErred={emailErr}
							validateOn={['change', 'input']}
						/>
						<button
							type="submit"
							class="transit bg-fill text-color hover m-o__ver"
							disabled={emailErr || !email}
						>
							{btnTexts[+$firebase.needEmailAgain]}
						</button>
					</svelte:fragment>
				</WaitForIt>
			</form>
		</svelte:fragment>
	</WaitForIt>
</main>

<style>
	main {
		min-height: calc(100vh - var(--header-height));
		justify-content: center;
	}

	h3 {
		font-size: var(--font-size-fluid-2);
	}

	form {
		padding: 2.5rem 5rem;
		border-radius: 1em;
		background-color: var(--clr__dk-main);
		font-size: var(--font-size-fluid-1);
		color: var(--clr__lt-almost);
	}

	main :global(input) {
		text-align: center;
	}

	button {
		padding: 0.5em 1em;
		border-radius: 0.25em;
		--transit__start: transparent;
		--transit__end: var(--clr__accent--);
		--text-start: var(--clr__lt-main);
		--text-end: var(--clr__dk-main);
	}
</style>
