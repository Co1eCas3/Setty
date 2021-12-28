<script>
	import { page } from '$app/stores';
	import { user } from '../../stores/user';
	import * as siteMap from '../../utils/siteMap';

	import NavItem from './NavItem.svelte';

	$: isBandPage = !!$page.params.band;
	$: showUserLinks = !!$user && !isBandPage;

	$: links = [
		{
			show: showUserLinks,
			title: 'Profile',
			href: siteMap.userProfile
		},
		{
			show: showUserLinks,
			title: 'Bands',
			href: siteMap.userBands,
			next: [
				{
					show: true,
					title: 'New Band',
					href: siteMap.newBand
				}
			]
			// $user &&
			// $user.bands
			// 	.map((band) => ({
			// 		show: true,
			// 		title: band.name,
			// 		href: siteMap.band(band.webSafeName)
			// 	}))
			// 	.concat({
			// 		show: true,
			// 		title: 'New Band',
			// 		href: '/user#bands?add=true'
			// 	})
		},
		{
			show: isBandPage,
			title: 'Set Lists',
			href: siteMap.band($page.params.band),
			next: $user !== null && [
				{
					show: true,
					title: 'New Set List',
					href: siteMap.newList($page.params.band)
				}
			]
		},
		{
			show: isBandPage,
			title: 'Repertoire',
			href: siteMap.repertoire($page.params.band)
		}
	];
</script>

<nav>
	<ul>
		{#each links as link}
			{#if link.show}
				<NavItem {...link} />
			{/if}
		{/each}
	</ul>
</nav>

<style>
	nav {
		height: 100%;
		flex-grow: 2;
		font-size: 1.5rem;
		display: flex;
		justify-content: flex-end;
	}

	ul {
		width: min-content;
		height: 100%;
		display: flex;
		gap: 2em;
		justify-content: flex-end;
		place-items: center;
	}
</style>
