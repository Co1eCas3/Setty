<script>
	import { page } from '$app/stores';

	import * as siteMap from '../../utils/siteMap';
</script>

<aside>
	<nav>
		<ul>
			<li class:active={$page.url.pathname.endsWith('account')}>
				<a href={siteMap.userAccount}>Account</a>
			</li>
			<li class:active={$page.url.pathname.endsWith('bands')}>
				<a href={siteMap.userBands}>Bands</a>
			</li>
		</ul>
	</nav>
</aside>

<style>
	aside {
		grid-area: user-nav;
		font-size: 1.5rem;
		color: var(--clr__dk-main);
	}

	nav,
	ul,
	li,
	a {
		width: 100%;
	}

	li {
		position: relative;
		height: calc(var(--header-height) / 1.2);
		padding: 0 1.5em;
		box-shadow: 0 7px 4px -7px var(--clr__dk-half);
		color: var(--clr__dk-half);
	}

	.active {
		color: var(--clr__dk-main);
	}

	.active::after {
		content: '';
		position: absolute;
		top: 0;
		left: 98%;
		width: 0;
		height: 0;
		border-width: calc(calc(var(--header-height) / 1.2) / 2);
		border-style: solid;
		border-color: transparent transparent transparent var(--clr__dk-dim);
	}

	a {
		height: 100%;
		display: flex;
		place-items: center;
	}
</style>
