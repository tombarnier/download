#!/bin/bash 


#set -x
# Récupère le token pour l'authenticationtification avec featherjs

#Variable qui contient toutes les series de la page 1 sous la forme " lien - NomSerie - LastSaison"

DownloadSerie ()
{
	echo "TESTE:$1"
	serie=$1
	echo "SERIE:$serie"
	#on créer une variable contenant les infos de la série
	#on créer un objet JSON qui va recevoir les paramètre du json a envoyer petit a ptit
	JSON="{\"name\":"
	#Nom de la serie
	NAMESERIE=$(echo $serie | grep -o '[0-9]-.*-saison' | sed -e "s/saison//g" -e "s/-/ /g"|cut -c3- )
	JSON="$JSON\"$NAMESERIE\","
	#le lien vers la serie
	JSON="$JSON\"lien\":\"$serie\","
	# On récupère les liens vers les autres saisons
	CURL=$(timeout 2 curl -s -L $serie)
	if [ $? -eq 1 ]
	then
		CURL=$(curl -s -L $serie)
	fi
	LIENSAISONS=$(echo $CURL | sed -e "s/href/\nhref/g" |grep -o '"/[0-9]*[-]*.*-saison-.*.html"') 
	# on raccourci Lien pour qu 'il soit comme les autres
	LIEN=$(echo $serie | sed -e "s/https:\/\/zone-telechargement1.ws\/telecharger-series//g")
	LIENSAISONS=$(echo -e "$LIENSAISONS\n$LIEN" | sed -e 's/"//g')
	LIENSAISONS=$(timeout 2 curl -s -L $serie | sed -e "s/href/\nhref/g" |grep -o '"/[0-9]*[-]*.*-saison-.*.html"' | sed  -e "s/\"//g")
	if [ $? -eq 1 ]
	then
		LIENSAISONS=$(timeout 2 curl -s -L $serie | sed -e "s/href/\nhref/g" |grep -o '"/[0-9]*[-]*.*-saison-.*.html"' | sed  -e "s/\"//g")
	fi
	LIENSAISONS=$(echo -e "$LIENSAISONS\n$serie" |  grep -o '/[0-9]*-.*-saison-.*.html' ) 
	#On initialise SAISON pour créer un tableau de saisons
	SAISONS="["
	#On va parcourir les liens de chaque saisons
	for liensaisons in $LIENSAISONS
	do 
		echo $liensaisons
		#On récupère les méta pour avoir le nun de la saison la lang la qualité etc
		INFO=$(timeout 2 curl -s -L  $HTTP$liensaisons | grep  -o "[Q|q]ualité .* [S|s]aison [0-9]" | head -n1 )
		if [ $? -eq 1 ]
		then
			INFO=$(curl -s -L  $HTTP$liensaisons | grep  -o "[Q|q]ualité .* [S|s]aison [0-9]" | head -n1 )
		fi
		TYPE=$(echo $INFO | egrep -o "[1]?[0|7][8|2]0p")
		LANGUE=$( echo $INFO | egrep -o '(VOSTFR|FRENCH)')
		NUM=$( echo $INFO | grep -o "[s|S]aison [0-9]*" | grep -o "[0-9]*")
		# on initialise LIENS pour créer un tableau avec les liens de chaque épisode
		LIENS="["
		#On remplit SAISON comme un tableau en json
		#une variable pour compter les épisodes
		I=1
		TEST="patest"
		EPISODES=$(timeout 2 curl -s -L $HTTP$liensaisons| grep -o 'http[s]*://www.dl-protect1.com/[a-z0-9]*' | grep "123455602")
		if [ $? -eq 1 ]
		then
			EPISODES=$(curl -s -L $HTTP$liensaisons| grep -o 'http[s]*://www.dl-protect1.com/[a-z0-9]*' | grep "123455602")
		fi
		if [ -n "$EPISODES" ] && [ -n "$TYPE" ]
		then
			SAISONS="$SAISONS{\"num\":\"$NUM\",\"lienSaison\":\"$HTTP$liensaisons\",\"type\":\"$TYPE\",\"lang\":\"$LANGUE\",\"liens\":"
			for episode in $EPISODES
			do 
				echo $episode
				episode=$(echo $episode | sed -e "s/https/http/g");
				if [ $TEST = "patest" ]
				then
					echo "on teste une première fois"
					EP=$(timeout 2 curl -s -L -X POST $episode -H " enctype: multipart/form-data " -d 'submit=Continuer'| grep -o "http[s]*://uptobox.com/[0-9a-z]*" | sed "1d")
					if [ $? -eq 1 ]
					then
						EP=$(curl -s -L -X POST $episode -H " enctype: multipart/form-data " -d 'submit=Continuer'| grep -o "http[s]*://uptobox.com/[0-9a-z]*" | sed "1d")
					fi
					UPTOBOX=$(echo $episode | sed -e "s/http:\/\/www.dl-protect1.com\///g" -e "s/123455600/http:\/\//g" -e "s/123455601/https:\/\//g" -e "s/123455602/uptobox/g" -e "s/123455610/.com/g" -e "s/123455615/\//g")
					if [ $UPTOBOX = $EP ]
					then
						TEST="yes"
					else 
						TEST="no"
					fi 
				elif [ "$TEST" == "no" ]
				then
					echo "on récupère depuis le site"
					EP=$(timeout 2 curl -s -L -X POST $episode -H " enctype: multipart/form-data " -d 'submit=Continuer'| grep -o "http://uptobox.com/[0-9a-z]*" | sed "1d")
					if [ $? -eq 1 ]
					then
						EP=$(curl -s -L -X POST $episode -H " enctype: multipart/form-data " -d 'submit=Continuer'| grep -o "http://uptobox.com/[0-9a-z]*" | sed "1d")
					fi
				elif [ "$TEST" == "yes" ]
				then
					echo "on peut décrypter"
					EP=$(echo $episode | sed -e "s/http:\/\/www.dl-protect1.com\///g" -e "s/123455600/http:\/\//g" -e "s/123455601/https:\/\//g" -e "s/123455602/uptobox/g" -e "s/123455610/.com/g" -e "s/123455615/\//g")
				fi
				LIENS="$LIENS{\"episode\":\"$I\",\"lien\":\"$EP\"},"
				I=$(( $I + 1))
			done 
			LIENS="$LIENS]"
			SAISONS="$SAISONS$LIENS},"
		fi
	done 
	SAISONS=$(echo -e "$SAISONS]\n")
	JSON="$JSON\"saisons\":$SAISONS}"
	JSON=$(echo $JSON | sed -e "s/,]/]/g" -e "s/,}/}/g")
	if [ -n "$JSON" ]
	then
		curl -X POST http://localhost:3030/series -H "Content-Type:application/json" -H "Authorization: Bearer $TOKEN" -d "$JSON"
		return 0
	else
		return 1
	fi
}
if [ $# -eq 0 ]
then
	echo -e "help \n -l suivi d'un lien pour télacharger juste une série \n -p suivi d'un chiffre pour telecharger x pages de zt \n -u pour faire une update et télcharger toute la derniere page a mettre en cron"
else
	TOKEN=$(curl -s -X POST -H "Content-Type:application/json"  http://localhost:3030/authentication -d '{"strategy":"local","email":"tom","password":"tom"}' | jq '.accessToken' | sed -e "s/\"//g") 
	echo $TOKEN
	# Finalement inutile je pense
	HTTP="https://zone-telechargement1.ws/telecharger-series"
	while getopts l:p:uh option
	do 
		case "${option}"
		in 
			l) 
				SERIES=${OPTARG};
				echo $SERIES;
				DownloadSerie $SERIES;;
			p)
				for page in `seq 1 ${OPTARG}`;
				do
					SERIES=$(curl -s -L https://www.zone-telechargement1.org/serie-vostfr/page/$page | grep -o 'http[s]*://.*telecharger-series/[0-9]*-.*-saison-[0-9]*-.*html' |sed '1~2d')
				echo $SERIES;
					DownloadSerie $SERIES
				done;;

			u)
				SERIES=$(curl -s -L https://www.zone-telechargement1.org/series-vostfr/ | egrep -o 'http[s]*://.*zone-telechargement.*/telecharger-series/[0-9a-z]*.*.html' | sed '1~2d')
				echo -e $SERIES;
				for serie in $SERIES 
				do 
					DownloadSerie $serie;
				done;;
			h)
				echo -e "help \n -l suivi d'un lien pour télacharger juste une série \n -p suivi d'un chiffre pour telecharger x pages de zt \n -u pour faire une update et télcharger toute la derniere page a mettre en cron"
		esac
	done
	echo $SERIES
fi



