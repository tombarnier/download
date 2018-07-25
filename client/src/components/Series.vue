<template>
<div class="ui container">
	<div class="ui two column stackable grid"
		<div class="column">
			<button class="ui button" v-on:click="UpdateFrontPage">
				<i class="rocket icon"></i>
				<span>Launch upadte on latest</span>
			</button>
		</div>
		<div class="column">
			<h1 class="ui dividing header"> Liste Des Series</h1>
			<ul>
				<li v-for="serie in series" :key="serie._id"><h3>{{serie.name}}</h3></br>
					<router-link :to="{ name: 'serie' , params: { id: serie._id } }"  class="ui button icon"><i class="film icon"></i>{{serie.name}}</router-link>
					Lien zt vers la série:{{serie.lien}} </br>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
import { serieService } from '@/services'
import { serieLookup } from '@/services'
export default {
	name: 'series',
	data: function () {
		return {
			select : null,
			currentFilter: 'all',
			series: []
		}
	},
	beforeRouteEnter (to,from, next) {
		serieService.find({
			query: {
				$limit: 1000,
				$all: true
			}
		}).then((response) => {
			next((vm) => {
				vm.setSeries(response.data)
			})
		}).catch((e) => {
			console.log(e)
			next({ name: 'home' })
		})
	},
	beforeRouteupdate (to,from, next) {
		serieService.find({
			query: {
				$limit: 1000,
				$all: true
			}
		}).then((response) => {
			this.setSeries(reponse.data)
			netx()
		}).catch((e) => {
			console.log(e)
			next({ name: 'home' })
		})
	},
	methods: {
		setSeries (series) {
			this.series = series
		},
		UpdateFrontPage() {
			serieLookup.create({}).then((response) => {
				console.log(response)
			});
		}
	}
}
</script>

