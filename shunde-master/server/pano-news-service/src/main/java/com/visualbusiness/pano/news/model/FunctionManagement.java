package com.visualbusiness.pano.news.model;
// Generated 2017-3-31 14:26:07 by Hibernate Tools 5.2.1.Final

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * FunctionManagement generated by hbm2java
 */
@Entity
@Table(name = "FUNCTION_MANAGEMENT")
public class FunctionManagement implements java.io.Serializable {

	@Id
	@Column(name = "FUNCTION_MANAGEMENT_ID")
	private int functionManagementId;
	@Column(name = "FUNCTION_MANAGEMENT_PID")

	private Integer functionManagementPid;
	@Column(name = "FUNCTION_NAME")

	private String functionName;
	@Column(name = "FUNCTION_URL")
	private String functionUrl;
	private String type;
	@Column(name = "ORDER_INDEX")
	private Integer orderIndex;
	@Column(name = "CREATE_TIME_MILLIS")
	private Long createTimeMillis;
	@Column(name = "UPDATE_TIME_MILLIS")
	private Long updateTimeMillis;

	public FunctionManagement() {
	}

	public FunctionManagement(int functionManagementId) {
		this.functionManagementId = functionManagementId;
	}

	public FunctionManagement(int functionManagementId, Integer functionManagementPid, String functionName,
			String functionUrl, String type, Integer orderIndex, Long createTimeMillis, Long updateTimeMillis) {
		this.functionManagementId = functionManagementId;
		this.functionManagementPid = functionManagementPid;
		this.functionName = functionName;
		this.functionUrl = functionUrl;
		this.type = type;
		this.orderIndex = orderIndex;
		this.createTimeMillis = createTimeMillis;
		this.updateTimeMillis = updateTimeMillis;
	}

	public int getFunctionManagementId() {
		return this.functionManagementId;
	}

	public void setFunctionManagementId(int functionManagementId) {
		this.functionManagementId = functionManagementId;
	}

	public Integer getFunctionManagementPid() {
		return this.functionManagementPid;
	}

	public void setFunctionManagementPid(Integer functionManagementPid) {
		this.functionManagementPid = functionManagementPid;
	}

	public String getFunctionName() {
		return this.functionName;
	}

	public void setFunctionName(String functionName) {
		this.functionName = functionName;
	}

	public String getFunctionUrl() {
		return this.functionUrl;
	}

	public void setFunctionUrl(String functionUrl) {
		this.functionUrl = functionUrl;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getOrderIndex() {
		return this.orderIndex;
	}

	public void setOrderIndex(Integer orderIndex) {
		this.orderIndex = orderIndex;
	}

	public Long getCreateTimeMillis() {
		return this.createTimeMillis;
	}

	public void setCreateTimeMillis(Long createTimeMillis) {
		this.createTimeMillis = createTimeMillis;
	}

	public Long getUpdateTimeMillis() {
		return this.updateTimeMillis;
	}

	public void setUpdateTimeMillis(Long updateTimeMillis) {
		this.updateTimeMillis = updateTimeMillis;
	}

}