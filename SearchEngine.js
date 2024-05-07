
myContentData={
	numResults:0,
	lResult:-1,
	rResult:-1,
	loadedTags:[],
	loadedID:null,
	currentPageIndex:1,
	showTags:1
}
async function addTag(ele){
	if(event.key!='Enter')return;
	var params = new URLSearchParams(window.location.search)
	var currentTags=""
	if(params.has("tags")){
		currentTags=params.get("tags")
	}
	const unrolledTags=currentTags.split("+")
	var hasNewTag=false
	var id=0
	await $.getJSON('/Blogs/tags.json', function(data){
		console.log("add");
		id=parseInt(data.Tags[ele.srcElement.value].ID);
	}).fail(function(){
		console.log("fetch tags failed")
	})
	unrolledTags.forEach((tagid)=>{
		console.log(tagid)
		if(tagid==id.toString()){
			hasNewTag=true
		}
	})
	if(!hasNewTag){
		if(currentTags!=""){
			currentTags=currentTags+'+'
		}
		currentTags=currentTags+id.toString()
	}
	params.set("tags",currentTags)
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}
function addID(ele){
	if(event.key!='Enter')return;
	var params = new URLSearchParams(window.location.search)
	var currentTags=""
	if(params.has("ids")){
		currentTags=params.get("ids")
	}
	if(currentTags!="")currentTags+="+";
	currentTags+=ele.srcElement.value
	params.set("ids",currentTags)
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}
function deleteTag(id){
	var params = new URLSearchParams(window.location.search)
	var currentTags=""
	if(params.has("tags")){
		currentTags=params.get("tags")
	}
	else return;
	const unrolledTags=currentTags.split("+")
	var newTagString=""
	unrolledTags.forEach((tagid)=>{
		if(tagid!=id.toString()){
			if(newTagString!=""){
				newTagString=newTagString+'+'
			}
			newTagString=newTagString+tagid
		}
	})
	params.set("tags",newTagString)
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}
function deleteID(id){
	var params = new URLSearchParams(window.location.search)
	var currentIDs=""
	if(params.has("ids")){
		currentIDs=params.get("ids")
	}
	else return;
	unrolledIDs=currentIDs.split("+")
	var newIDString=""
	unrolledIDs.forEach((curID)=>{
		if(curID.toString()!=id.toString()){
			if(newIDString!="")newIDString+='+'
			newIDString+=curID.toString();
		}
	})
	params.set("ids",newIDString)
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}
async function loadTags(){
	var params = new URLSearchParams(window.location.search)
	var currentTags=""
	if(params.has("tags")){
		currentTags=params.get("tags")
	}
	var unrolledTags=currentTags.split("+")
	await $.getJSON('/Blogs/tags.json', function(data){
		myContentData.loadedTags=data.Tags
		unrolledTags.forEach((tagid)=>{
			let editLocation=document.getElementById('LoadedTags')
			if(tagid!=""){
				editLocation.innerHTML+=
						`<div class="TagItem" style="background-color:`+data.Tags[data.IDtoTag[tagid]].color+`;padding-left:15px;"><div style="margin-right:10px;text-align:center;">`
							+(data.IDtoTag[parseInt(tagid)]).toString()+`
							</div>
							<button type="button" onclick="deleteTag(`+parseInt(tagid)+`)">&#x2715;</button>
						</div>`
			}
		})
	})
}
function loadIDs(){
	var params = new URLSearchParams(window.location.search)
	var currentIDs=""
	if(params.has("ids")){
		currentIDs=params.get("ids")
	}
	var unrolledIDs=currentIDs.split("+")
	unrolledIDs.forEach((id)=>{
		let editLocation=document.getElementById('LoadedIDs')
		if(id!=""){
			editLocation.innerHTML+=
					`<div class="TagItem" style="background-color:#fc58cb;padding-left:15px;"><div style="margin-right:10px;text-align:center;">`
						+(id).toString()+`
						</div>
						<button type="button" onclick="deleteID('`+id+`')">&#x2715;</button>
					</div>`
		}
	})

}

function pagePrevious(){
	var params = new URLSearchParams(window.location.search)
	var curPage=(params.has("page")?params.get("page"):1)
	curPage=Math.max(1,curPage-1)
	params.set("page",curPage.toString())
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}

function pageNext(){
	var params = new URLSearchParams(window.location.search)
	var curPage=(params.has("page")?params.get("page"):1)
	++curPage
	params.set("page",curPage.toString())
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}

function changePage(ele){
	if(event.key!='Enter')return;
	var params = new URLSearchParams(window.location.search)
	curPage=Math.max(parseInt(ele.srcElement.value),1)
	params.set("page",curPage.toString())
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}

async function loadBlogs(){
	var params=new URLSearchParams(window.location.search)
	var name=""
	var rolledIDs=""
	var tags=""
	var rolledTags=""
	var page=1;
	if(params.has("page")){
		page=parseInt(params.get("page"))
	}
	if(params.has("name")){
		name=params.get("name").toLowerCase()
	}
	if(params.has("ids")){
		rolledIDs=params.get("ids").toLowerCase()
	}
	if(params.has("tags")){
		rolledTags=params.get("tags")
	}
	var unrolledTags=rolledTags.split("+")
	var unrolledIDs=rolledIDs.split("+")
	var satisfiedArticles=[]
	var data
	await $.getJSON('Blogs/catalog.json', function(tData){
		data=tData
		console.log("Article Catalog Successfully Loaded!")

	})
	await $.getJSON('/Blogs/tags.json', function(TagData){
		console.log("Tags Successfully Loaded!")
		var i=0
		data.Blogs.forEach((article)=>{
			if(name==""||article.name.toLowerCase().indexOf(name.toLowerCase())>-1){
				var flag=false;
				unrolledTags.every((tagid)=>{
					if(tagid!=""&&!article.tags.includes(parseInt(tagid))){
						flag=true
						return false
					}
					return true
				})
				if(!flag)unrolledIDs.every((ID)=>{
					if(ID!=""&&!article.IDs.includes(ID)){
						flag=true
						return false
					}
					return true
				})
				if(!flag){
					satisfiedArticles.push(i)
				}
			}
			++i
		})
		myContentData.numResults=satisfiedArticles.length
		if(20*(page-1)>=myContentData.numResults){
			myContentData.lResult=0
			myContentData.rResult=0
		}
		else{
			myContentData.lResult=20*(page-1)+1
			myContentData.rResult=Math.min(myContentData.numResults,20*page)
		}
		myContentData.currentPageIndex=page
		/*
		var lResEditLoc=document.getElementById('lRes')
		var rResEditLoc=document.getElementById('rRes')
		var tResEditLoc=document.getElementById('tRes')
		lResEditLoc.innerHTML=myContentData.lResult
		rResEditLoc.innerHTML=myContentData.rResult
		tResEditLoc.innerHTML=myContentData.numResults
		*/
		if(myContentData.rResult!=0){
			var editLocation=document.getElementById('LoadedBlogs')
			var BlogInfo=document.getElementById('BlogSearchInfo')
			BlogInfo.innerHTML+="Showing results "+(myContentData.lResult).toString()+" to "+(myContentData.rResult).toString()+" of "+(satisfiedArticles.length).toString()
			for(var i=myContentData.lResult-1;i<myContentData.rResult;++i){
				var newRow=`<tr class="BlogItem" style="background-color:`+((i%2==0)?"#9964fa":"#98c9f5")+`;">
						<td class="BlogItemID">
							`+data.Blogs[satisfiedArticles[i]].BlogID+`
						</td>
						<td class="BlogItemTitle">
							<a class="BlogItemHyperLink" href="`+data.Blogs[satisfiedArticles[i]].dir+`">`+data.Blogs[satisfiedArticles[i]].name+`</a>
						</td>
						<td class="BlogItemTags">
							<div class="TagBox">
								<div class="TagBoxList">
							`
				data.Blogs[satisfiedArticles[i]].tags.forEach((tag)=>{
					newRow+=`<div class="TagItem" style="background-color:`+TagData.Tags[TagData.IDtoTag[tag.toString()]].color+`;padding-left:15px;"><div style="margin-right:10px;text-align:center;">`
							+(TagData.IDtoTag[tag.toString()]).toString()+`
							</div>
						</div>`
				})
				newRow+=`   	</div>
							</div>
						</td>
						<td class="BlogItemDate">
							`+data.Blogs[satisfiedArticles[i]].date+`
						</td>
					</tr>`
				editLocation.innerHTML+=newRow
			}
		}
	//loadPageSelector()
	})
}
/*
function tagSearch(){
	if(event.keyCode==13){
		input=document.getElementById("TagInput")
		tagname=input.value.toLowerCase()
		myContentData.loadedTags.forEach((tag)=>{
			if(tagname==tag.name){
				addTag(parseInt(tag.tagid))
			}
		})
		return
	}
	input=document.getElementById("TagInput")
	tagname=input.value.toLowerCase()
	myContentData.loadedTags.forEach((tag)=>{
		var editLoc=document.getElementById(`DropdownTagSearchItem`+(parseInt(tag.tagid)).toString())
		if(tagname==""||tag.name.indexOf(tagname)!=-1){
			editLoc.hidden=false
		}
		else{
			editLoc.hidden=true
		}
	})
}
*/
function nameSearch(event){
	if(event.key!="Enter"){
		return
	}
	input=document.getElementById("NameInput")
	name=input.value.toLowerCase()
	var params = new URLSearchParams(window.location.search)
	params.set("name",encodeURIComponent(name))
	var newPathQuery=window.location.pathname+'?'+params.toString()
	window.location.href=newPathQuery
}