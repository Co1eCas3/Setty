<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import isEmpty from 'validator/lib/isEmpty';
	import deepcopy from 'deepcopy';

	import { user } from '$lib/stores/auth';
	import ctxKey from '$lib/utils/ctxKey.js';
	import { useToken } from '$lib/utils/token.js';
	import { urlMaker } from '$lib/utils/helpers.js';

	import NewBandInfoForm from './NewBandInfoForm.svelte';
	import NewBandInviteesForm from './NewBandInviteesForm.svelte';
	import CreateBandFailed from './CreateBandFailed.svelte';
	import Loader from '$lib/components/utilities/Loader.svelte';

	export let closeWhenDone;

	const newBandStore = writable({
		bandRole: 1,
		userRole: 5,
		otherBandRoleDescription: '',
		band: {
			name: '',
			webSafeName: '',
			users: []
		}
	});

	setContext(ctxKey, newBandStore);

	let curStep = 0;
	const steps = [NewBandInfoForm, NewBandInviteesForm, CreateBandFailed];
	let isReady,
		submitting = false;

	const advance = () => curStep++;
	const regress = () => curStep--;

	function prepForSend() {
		const copyForSend = deepcopy($newBandStore);
		copyForSend.band.users = copyForSend.band.users.reduce(
			(validInvitees, invitee, _, invitees) => {
				if (isEmpty(invitee.email)) {
					if (invitees.length === 1) return [];
					return validInvitees;
				}

				validInvitees.push(invitee);
				return validInvitees;
			},
			[]
		);

		return copyForSend;
	}

	// TODO: a 'created' message of some kind
	// TODO: send firebase emails (silent & and an app-wide message? wait til complete?)
	async function createBand() {
		submitting = true;
		const newBand = prepForSend();
		const res = await user.createBand(newBand);
		submitting = false;

		if (!res) return advance();
		closeWhenDone(newBand.band.webSafeName);
	}
</script>

<form class="form-cont" on:submit|preventDefault={createBand}>
	{#if submitting}
		<Loader />
	{:else}
		<h1>Add a new band</h1>

		<svelte:component this={steps[curStep]} bind:isReady />

		<div class="btn-cont">
			<button class:btnVisible={curStep === 1 || curStep === 2} on:click|preventDefault={regress}
				>Back</button
			>
			<button class:btnVisible={curStep === 1} type="submit" disabled={!isReady}>Create Band</button
			>
			<button class:btnVisible={curStep === 0} on:click|preventDefault={advance} disabled={!isReady}
				>Next</button
			>
		</div>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 1rem;
	}

	button {
		visibility: hidden;
	}

	.btnVisible {
		visibility: visible;
	}
</style>
