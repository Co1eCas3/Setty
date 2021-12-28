<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import isEmpty from 'validator/lib/isEmpty';
	import deepcopy from 'deepcopy';

	import newBandKey from '../../utils/newBandContextKey.js';
	import { useToken } from '$lib/utils/token.js';
	import { urlMaker } from '$lib/utils/helpers.js';

	import NewBandInfoForm from './NewBandInfoForm.svelte';
	import NewBandInviteesForm from './NewBandInviteesForm.svelte';

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

	setContext(newBandKey, newBandStore);

	let curStep = 0;
	const steps = [NewBandInfoForm, NewBandInviteesForm];
	let isReady;

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

		// console.log(copyForSend);
		createBand(copyForSend);
	}

	async function createBand(newBand) {
		const url = urlMaker({ path: 'api/bands/create' });
		const res = await useToken(url, { method: 'POST', body: JSON.stringify(newBand) });

		console.log(res);
	}
</script>

<form class="form-cont" on:submit|preventDefault={prepForSend}>
	<h1>Add a new band</h1>

	<svelte:component this={steps[curStep]} bind:isReady />

	<div class="btn-cont">
		{#if !curStep}
			<button on:click={advance} disabled={!isReady}>Next</button>
		{:else}
			<button on:click={regress}>Back</button>
			<button type="submit" disabled={!isReady}>Create Band</button>
		{/if}
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 1rem;
	}
</style>
