<script>
	import { firebase } from '$lib/stores/firebase';

	export let waiting;
	let btnTxt = 'SIGN OUT';

	async function signOut() {
		waiting = true;
		const successful = await firebase.signOut();
		if (!successful) btnTxt = 'ERROR :(';
		waiting = false;
	}
</script>

<form on:submit|preventDefault={signOut} class="trans underline">
	<button type="submit" class="">{btnTxt}</button>
</form>

<style>
	* {
		color: inherit;
	}

	form,
	button {
		height: 100%;
	}
</style>
