<div class="outer-cont">
	<div class="cont">
		<span class="loader" />
	</div>
</div>

<style>
	.outer-cont {
		width: min-content;
		min-height: var(--height);
		margin: 0 var(--height);
		display: flex;
		justify-content: center;
		place-items: center;
	}

	.cont {
		margin: 0 auto;
		max-height: 0;
		display: flex;
		justify-content: center;
		place-items: center;
		--_height: var(--height, 2.5em);
	}

	.loader {
		width: calc(var(--_height) / 5);
		height: var(--_height);
		border-radius: calc(var(--_height) / 10);
		display: block;
		margin: calc(var(--_height) / 2) auto;
		position: relative;
		background: currentColor;
		color: #fff;
		box-sizing: border-box;
		animation: animloader 0.3s 0.3s linear infinite alternate;
	}

	.loader::after,
	.loader::before {
		width: calc(var(--_height) / 5);
		height: var(--_height);
		border-radius: calc(var(--_height) / 10);
		background: currentColor;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: calc(var(--_height) / 2);
		box-sizing: border-box;
		animation: animloader 0.3s 0.45s linear infinite alternate;
	}
	.loader::before {
		left: calc(calc(var(--_height) / 2) * -1);
		animation-delay: 0s;
	}

	@keyframes animloader {
		0% {
			height: calc(var(--_height) * 1.2);
		}
		100% {
			height: calc(var(--_height) / 10);
		}
	}
</style>
