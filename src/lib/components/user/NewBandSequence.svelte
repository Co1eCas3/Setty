<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import isEmpty from 'validator/lib/isEmpty';
	import deepcopy from 'deepcopy';

	import { user } from '../../stores/user';
	import ctxKey from '../../utils/ctxKey.js';
	import { useToken } from '$lib/utils/token.js';
	import { urlMaker } from '$lib/utils/helpers.js';

	import NewBandInfoForm from './NewBandInfoForm.svelte';
	import NewBandInviteesForm from './NewBandInviteesForm.svelte';
	import CreateBandFailed from './CreateBandFailed.svelte';

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

		createBand(copyForSend);
	}

	// TODO: a 'created' message of some kind
	// TODO: send firebase emails (silent & and an app-wide message? wait til complete?)
	async function createBand(newBand) {
		const url = urlMaker({ path: 'api/bands/create' });
		const res = await useToken(url, { method: 'POST', body: JSON.stringify(newBand) });

		if (!res.ok) {
			console.log(res.data.error);
			return advance();
		}

		$user.bands.push(res.data.band);
		closeWhenDone();
	}
</script>

<form class="form-cont" on:submit|preventDefault={prepForSend}>
	<h1>Add a new band</h1>

	<svelte:component this={steps[curStep]} bind:isReady />

	<div class="btn-cont">
		<button class:btnVisible={curStep === 1 || curStep === 2} on:click|preventDefault={regress}
			>Back</button
		>
		<button class:btnVisible={curStep === 1} type="submit" disabled={!isReady}>Create Band</button>
		<button class:btnVisible={curStep === 0} on:click|preventDefault={advance} disabled={!isReady}
			>Next</button
		>
	</div>
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
