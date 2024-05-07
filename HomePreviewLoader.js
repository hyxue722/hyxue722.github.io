async function loadPreviews(){
	var tagData
	
	await $.getJSON('/Blogs/tags.json',function(data){
		tagData=data
	})
	
	var loc=document.getElementById('BlogPreviews')
	await $.getJSON('/Blogs/catalog.json',function(blogData){
		var cnt=0
		for(var i=blogData.Blogs.length-1;i>=0;--i){
			var newPreview=""
			newPreview+=`<hr class="blog-preview-divider" /><div class="blog-preview">
						<div class="blog-preview-title">
							<a href="`+blogData.Blogs[i].dir+`" class="BlogPreviewTitleLink" style="text-decoration:none">`+blogData.Blogs[i].name+`</a>
						</div>
						<div class="blog-preview-description">
							`+blogData.Blogs[i].preview+`
						</div>
						<div class="blog-preview-details">
							<div>
								`+blogData.Blogs[i].date+`
							</div>
							<div>
							`
			var f=0;
			blogData.Blogs[i].tags.forEach((tag)=>{
				if(f==1)newPreview+=', '
				newPreview+=tagData.IDtoTag[tag.toString()]
				f=1;
			})
			newPreview+=	`</div>
						</div>
					</div>`
			loc.innerHTML+=newPreview
			if((++cnt)>=10)break;
		}
	})
}