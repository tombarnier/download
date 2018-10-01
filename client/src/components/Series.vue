<template>
<div class="ui container">
	<div class="ui two column stackable grid">
		<div class="column">
			<button class="ui button" v-on:click="UpdateFrontPage">
				<i class="rocket icon"></i>
				<span>Launch upadte on latest</span>
			</button>
			<button class="ui button" v-on:click="delALl">
				<i class="trash icon"></i>
				<span>Delete all</span>
			</button>
			<input v-model="page" type="number" min="1" max="35" placeholder="page">
			<button class="ui button" v-on:click="ScanSeries(page)">
				<i class="search icon"></i>
				<span>search new series on page {{page}} </span>
			</button>
			<h1 class="ui dividing header"> Liste Des Series</h1>
			<ul>
				<li v-for="serie in series" :key="serie._id"><h3>{{serie.name}}</h3></br>
					<router-link :to="{ name: 'serie' , params: { id: serie._id } }"  class="ui button icon"><i class="film icon"></i>{{serie.name}}</router-link>
					<a :href="serie.lien">Lien zt vers la série</a>
					<button class="ui button" @click="DeleteSerie(serie._id)" ><i class="trash icon"></i></button> </br>
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
				$all: true,
				$sort: {
					name: 1
				}
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
			serieLookup.create({action: "series",params: 1}).then((response) => {
				console.log(response)
			});
		},
		ScanSeries(num) {
			serieLookup.create({action: "series",params: num}).then((response) =>{
				console.log(response)
			})
		},
		DeleteSerie(serieId){
			serieService.remove(serieId).then((response) => {
				console.log(response)
			}).catch((err) => {
				console.log(err)
			})
		},
		delALl() {
			serieService.remove(null).then((response) => {
				console.log(response)
			}).catch((err) => {
					console.log(err)
			})
		}
	}
}
</script>
