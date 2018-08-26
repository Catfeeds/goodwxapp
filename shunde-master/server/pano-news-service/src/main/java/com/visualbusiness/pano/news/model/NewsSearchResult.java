package com.visualbusiness.pano.news.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class NewsSearchResult implements Serializable {
	private static final long serialVersionUID = 1L;

	private String albumId;
	
	private String albumName;

	private String albumInfo;

	private String albumDetail;

	private String thumbnailUrl;

	private String albumThumb;
	
	private String createDate;
	
	private String updateDate;
	
	private String createUser;
	
	private String updateUser;

	private Integer newsStatus;

	private List<LangInfo> langs = new ArrayList<LangInfo>();

	public String getAlbumThumb() {
		return albumThumb;
	}

	public void setAlbumThumb(String albumThumb) {
		this.albumThumb = albumThumb;
	}

	public String getAlbumId() {
		return albumId;
	}

	public void setAlbumId(String albumId) {
		this.albumId = albumId;
	}

	public String getAlbumName() {
		return albumName;
	}

	public void setAlbumName(String albumName) {
		this.albumName = albumName;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getAlbumInfo() {
		return albumInfo;
	}

	public void setAlbumInfo(String albumInfo) {
		this.albumInfo = albumInfo;
	}
	
	public String getAlbumDetail() {
		return albumDetail;
	}

	public void setAlbumDetail(String albumDetail) {
		this.albumDetail = albumDetail;
	}

	public String getThumbnailUrl() {
		return thumbnailUrl;
	}

	public void setThumbnailUrl(String thumbnailUrl) {
		this.thumbnailUrl = thumbnailUrl;
	}

	public static final class LangInfo implements Serializable {
		private static final long serialVersionUID = 1L;

		private String lang;
		private String createDate;
		private String updateDate;
		
		public String getLang() {
			return lang;
		}
		public void setLang(String lang) {
			this.lang = lang;
		}
		public String getCreateDate() {
			return createDate;
		}
		public void setCreateDate(String createDate) {
			this.createDate = createDate;
		}
		public String getUpdateDate() {
			return updateDate;
		}
		public void setUpdateDate(String updateDate) {
			this.updateDate = updateDate;
		}
	}



	public List<LangInfo> getLangs() {
		return langs;
	}

	public void setLangs(List<LangInfo> langs) {
		this.langs = langs;
	}

	public Integer getNewsStatus() {
		return newsStatus;
	}

	public void setNewsStatus(Integer newsStatus) {
		this.newsStatus = newsStatus;
	}
}