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

<form on:submit|preventDefault={signOut}>
	<button type="submit">{btnTxt}</button>
</form>

<style>
	form {
		height: 100%;
	}

	button {
		height: 100%;
		background-color: transparent;
		font-family: inherit;
		font-size: inherit;
		color: var(--txt__lt-half);
		border: none;
		cursor: pointer;
		display: flex;
		place-items: center;
		transition: color 0.1s linear;
	}

	button:hover {
		color: var(--clr__accent);
	}
</style>
