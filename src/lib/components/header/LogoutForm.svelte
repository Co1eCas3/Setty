<script>
	import { firebase } from '$lib/stores/auth';

	let btnTxt = 'SIGN OUT';

	async function signOut() {
		const successful = await firebase.signOut();
		if (!successful) btnTxt = 'ERROR :(';
	}
</script>

<form on:submit|preventDefault={signOut} class="flex">
	<button type="submit" class="flex transit underline text-color hover m-o__hor">{btnTxt}</button>
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
		justify-content: flex-start;
		--text-start: var(--clr__lt-half);
		--text-end: var(--clr__lt-main);
	}
</style>
