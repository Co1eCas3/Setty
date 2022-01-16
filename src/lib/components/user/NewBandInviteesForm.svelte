<script>
	import { getContext } from 'svelte';

	import ctxKey from '$lib/utils/ctxKey';
	import userRoleMap from '$lib/utils/userRoleMap';
	import bandRoleMap from '$lib/utils/bandRoleMap';
	import * as validate from '$lib/utils/validate';

	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';
	import ContentEditableSelect from '$lib/components/utilities/ContentEditableSelect.svelte';

	export let isReady;

	const newBand = getContext(ctxKey);

	if (!$newBand.band.users.length) addInvitee();

	$: emailErrors = [];
	$: isReady = emailErrors.every((isError) => !isError);

	function addInvitee() {
		$newBand.band.users = [
			...$newBand.band.users,
			{
				email: '',
				userRole: 3,
				bandRole: 2,
				otherBandRoleDescription: ''
			}
		];
	}

	function removeInvitee(inviteeInd) {
		const copy = [...$newBand.band.users];
		copy.splice(inviteeInd, 1);
		$newBand.band.users = copy;
	}
</script>

<legend class="flex stack">
	<h3>Invite bandmates</h3>

	{#each $newBand.band.users as invitee, i}
		<div class="invitee-cont flex">
			<fieldset class="flex">
				<ValidatedInput
					class="email-inp"
					type="email"
					placeholder="bandmate@band.com"
					bind:value={invitee.email}
					transform={(val) => val.toLowerCase()}
					validation={validate.email}
					bind:isErred={emailErrors[i]}
					showErrOnBlur={true}
				/>

				<ContentEditableSelect class="select" bind:selectedValue={invitee.userRole}>
					{#each userRoleMap as role, val}
						{#if val >= 2}
							<option value={val}>{role}</option>
						{/if}
					{/each}
				</ContentEditableSelect>

				<!-- <select bind:value={invitee.userRole}>
					{#each userRoleMap as role, val}
						{#if val >= 2}
							<option value={val}>{role}</option>
						{/if}
					{/each}
				</select> -->

				<ContentEditableSelect
					class="select"
					bind:selectedValue={invitee.bandRole}
					bind:customValue={invitee.otherBandRoleDescription}
				>
					{#each bandRoleMap as role, val}
						<option value={val} contenteditable={!val}>{role}</option>
					{/each}
				</ContentEditableSelect>
			</fieldset>

			<div class="add-remove-cont">
				<button on:click={() => removeInvitee(i)} disabled={$newBand.band.users.length === 1}>
					X
				</button>
				{#if i === $newBand.band.users.length - 1}
					<button on:click={addInvitee}>+</button>
				{/if}
			</div>
		</div>
	{/each}
</legend>

<style>
	legend {
		padding: 1rem 2rem;
		font-size: var(--font-size-fluid-1);
		color: var(--clr__lt-main);
		gap: 0.4rem;
	}

	h3 {
		color: var(--clr__lt-half);
	}

	.invitee-cont {
		width: 50ch;
		padding: 1em 2em;
	}

	fieldset {
		padding: 0.5rem 2rem;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem;
	}

	fieldset :global(.email-inp) {
		flex-basis: 100%;
	}

	fieldset :global(.select) {
		flex-basis: calc(50% - 1rem);
	}
</style>
