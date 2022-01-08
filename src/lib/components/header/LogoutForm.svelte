<script>
	import { firebase } from '$lib/stores/firebase';

	let btnTxt = 'SIGN OUT';

	async function signOut() {
		const successful = await firebase.signOut();
		if (!successful) btnTxt = 'ERROR :(';
	}
</script>

<form on:submit|preventDefault={signOut} class="flex">
	<button type="submit" class="">{btnTxt}</button>
</form>

<style>
	* {
		color: inherit;
	}

	form,
	button {
		min-height: calc(var(--header-height) / 1.6);
	}

	button {
		color: var(--clr__lt-half);
		transition: color 0.1s;
	}

	button::after {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-bottom: 0.125rem solid var(--clr__accent);
		transform-origin: center;
		transform: scaleX(0);
		transition: transform 0.2s ease-out;
	}

	button:hover,
	button:hover::after {
		color: var(--clr__lt-main);
		transform: scaleX(1);
	}
</style>
