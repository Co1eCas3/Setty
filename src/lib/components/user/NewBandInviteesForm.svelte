<script>
	import { getContext } from 'svelte';

	import ctxKey from '$lib/utils/ctxKey';
	import userRoleMap from '$lib/utils/userRoleMap';
	import bandRoleMap from '$lib/utils/bandRoleMap';
	import * as validate from '$lib/utils/validate';

	import ValidatedInput from '../utilities/ValidatedInput.svelte';
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

<legend>
	<h3>Invite bandmates</h3>

	{#each $newBand.band.users as invitee, i}
		<div class="invitee-cont">
			<fieldset>
				<ValidatedInput
					type="email"
					placeholder="bandmate@band.com"
					bind:value={invitee.email}
					validationFn={validate.email}
					validateOn={['change', 'input']}
					bind:isErred={emailErrors[i]}
				/>

				<select bind:value={invitee.userRole}>
					{#each userRoleMap as role, val}
						{#if val >= 2}
							<option value={val}>{role}</option>
						{/if}
					{/each}
				</select>

				<ContentEditableSelect
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
