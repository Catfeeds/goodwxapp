/*
 * Copyright (C) 2015 - 2017 Microscene Inc., All Rights Reserved.
 *
 */
package com.vizen.sd.repository.mysql.domain;

import java.util.ArrayList;
import java.util.List;

public class GridCriteria {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table grid
     */
    protected String orderByClause;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table grid
     */
    protected boolean distinct;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database table grid
     */
    protected List<Criteria> oredCriteria;

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public GridCriteria() {
        oredCriteria = new ArrayList<Criteria>();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public void setOrderByClause(String orderByClause) {
        this.orderByClause = orderByClause;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public String getOrderByClause() {
        return orderByClause;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public boolean isDistinct() {
        return distinct;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public List<Criteria> getOredCriteria() {
        return oredCriteria;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public void or(Criteria criteria) {
        oredCriteria.add(criteria);
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public Criteria or() {
        Criteria criteria = createCriteriaInternal();
        oredCriteria.add(criteria);
        return criteria;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public Criteria createCriteria() {
        Criteria criteria = createCriteriaInternal();
        if (oredCriteria.size() == 0) {
            oredCriteria.add(criteria);
        }
        return criteria;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    protected Criteria createCriteriaInternal() {
        Criteria criteria = new Criteria();
        return criteria;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table grid
     */
    public void clear() {
        oredCriteria.clear();
        orderByClause = null;
        distinct = false;
    }

    @Override
    public String toString() {
        return "GridCriteria [orderByClause=" + orderByClause + ",distinct=" + distinct + ",oredCriteria=" + oredCriteria + "]";
    }

    /**
     * This class was generated by MyBatis Generator.
     * This class corresponds to the database table grid
     */
    protected abstract static class GeneratedCriteria {
        protected List<Criterion> criteria;

        protected GeneratedCriteria() {
            super();
            criteria = new ArrayList<Criterion>();
        }

        public boolean isValid() {
            return criteria.size() > 0;
        }

        public List<Criterion> getAllCriteria() {
            return criteria;
        }

        public List<Criterion> getCriteria() {
            return criteria;
        }

        protected void addCriterion(String condition) {
            if (condition == null) {
                throw new RuntimeException("Value for condition cannot be null");
            }
            criteria.add(new Criterion(condition));
        }

        protected void addCriterion(String condition, Object value, String property) {
            if (value == null) {
                throw new RuntimeException("Value for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value));
        }

        protected void addCriterion(String condition, Object value1, Object value2, String property) {
            if (value1 == null || value2 == null) {
                throw new RuntimeException("Between values for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value1, value2));
        }

        public Criteria andGridIdIsNull() {
            addCriterion("grid_id is null");
            return (Criteria) this;
        }

        public Criteria andGridIdIsNotNull() {
            addCriterion("grid_id is not null");
            return (Criteria) this;
        }

        public Criteria andGridIdEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id =", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdNotEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id <>", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdGreaterThan(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id >", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdGreaterThanOrEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id >=", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdLessThan(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id <", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdLessThanOrEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_id <=", value, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdIn(List<Long> values) {
            if(values == null)return (Criteria)this;
            addCriterion("grid_id in", values, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdNotIn(List<Long> values) {
            if(values == null)return (Criteria)this;
            addCriterion("grid_id not in", values, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdBetween(Long value1, Long value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("grid_id between", value1, value2, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridIdNotBetween(Long value1, Long value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("grid_id not between", value1, value2, "gridId");
            return (Criteria) this;
        }

        public Criteria andGridCodeIsNull() {
            addCriterion("grid_code is null");
            return (Criteria) this;
        }

        public Criteria andGridCodeIsNotNull() {
            addCriterion("grid_code is not null");
            return (Criteria) this;
        }

        public Criteria andGridCodeEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code =", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeNotEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code <>", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeGreaterThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code >", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeGreaterThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code >=", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeLessThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code <", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeLessThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code <=", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code like", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeNotLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("grid_code not like", value, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("grid_code in", values, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeNotIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("grid_code not in", values, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("grid_code between", value1, value2, "gridCode");
            return (Criteria) this;
        }

        public Criteria andGridCodeNotBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("grid_code not between", value1, value2, "gridCode");
            return (Criteria) this;
        }

        public Criteria andParentIdIsNull() {
            addCriterion("parent_id is null");
            return (Criteria) this;
        }

        public Criteria andParentIdIsNotNull() {
            addCriterion("parent_id is not null");
            return (Criteria) this;
        }

        public Criteria andParentIdEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id =", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdNotEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id <>", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdGreaterThan(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id >", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdGreaterThanOrEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id >=", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdLessThan(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id <", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdLessThanOrEqualTo(Long value) {
            if(value == null)return (Criteria)this;
            addCriterion("parent_id <=", value, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdIn(List<Long> values) {
            if(values == null)return (Criteria)this;
            addCriterion("parent_id in", values, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdNotIn(List<Long> values) {
            if(values == null)return (Criteria)this;
            addCriterion("parent_id not in", values, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdBetween(Long value1, Long value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("parent_id between", value1, value2, "parentId");
            return (Criteria) this;
        }

        public Criteria andParentIdNotBetween(Long value1, Long value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("parent_id not between", value1, value2, "parentId");
            return (Criteria) this;
        }

        public Criteria andStatusIsNull() {
            addCriterion("status is null");
            return (Criteria) this;
        }

        public Criteria andStatusIsNotNull() {
            addCriterion("status is not null");
            return (Criteria) this;
        }

        public Criteria andStatusEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status =", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status <>", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusGreaterThan(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status >", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusGreaterThanOrEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status >=", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusLessThan(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status <", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusLessThanOrEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("status <=", value, "status");
            return (Criteria) this;
        }

        public Criteria andStatusIn(List<Integer> values) {
            if(values == null)return (Criteria)this;
            addCriterion("status in", values, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotIn(List<Integer> values) {
            if(values == null)return (Criteria)this;
            addCriterion("status not in", values, "status");
            return (Criteria) this;
        }

        public Criteria andStatusBetween(Integer value1, Integer value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("status between", value1, value2, "status");
            return (Criteria) this;
        }

        public Criteria andStatusNotBetween(Integer value1, Integer value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("status not between", value1, value2, "status");
            return (Criteria) this;
        }

        public Criteria andIsValidIsNull() {
            addCriterion("is_valid is null");
            return (Criteria) this;
        }

        public Criteria andIsValidIsNotNull() {
            addCriterion("is_valid is not null");
            return (Criteria) this;
        }

        public Criteria andIsValidEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid =", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidNotEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid <>", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidGreaterThan(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid >", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidGreaterThanOrEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid >=", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidLessThan(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid <", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidLessThanOrEqualTo(Integer value) {
            if(value == null)return (Criteria)this;
            addCriterion("is_valid <=", value, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidIn(List<Integer> values) {
            if(values == null)return (Criteria)this;
            addCriterion("is_valid in", values, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidNotIn(List<Integer> values) {
            if(values == null)return (Criteria)this;
            addCriterion("is_valid not in", values, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidBetween(Integer value1, Integer value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("is_valid between", value1, value2, "isValid");
            return (Criteria) this;
        }

        public Criteria andIsValidNotBetween(Integer value1, Integer value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("is_valid not between", value1, value2, "isValid");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinIsNull() {
            addCriterion("longitude_min is null");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinIsNotNull() {
            addCriterion("longitude_min is not null");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min =", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinNotEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min <>", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinGreaterThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min >", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinGreaterThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min >=", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinLessThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min <", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinLessThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min <=", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min like", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinNotLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_min not like", value, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("longitude_min in", values, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinNotIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("longitude_min not in", values, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("longitude_min between", value1, value2, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinNotBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("longitude_min not between", value1, value2, "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxIsNull() {
            addCriterion("longitude_max is null");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxIsNotNull() {
            addCriterion("longitude_max is not null");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max =", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxNotEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max <>", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxGreaterThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max >", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxGreaterThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max >=", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxLessThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max <", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxLessThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max <=", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max like", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxNotLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("longitude_max not like", value, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("longitude_max in", values, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxNotIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("longitude_max not in", values, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("longitude_max between", value1, value2, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxNotBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("longitude_max not between", value1, value2, "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinIsNull() {
            addCriterion("latitude_min is null");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinIsNotNull() {
            addCriterion("latitude_min is not null");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min =", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinNotEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min <>", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinGreaterThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min >", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinGreaterThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min >=", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinLessThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min <", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinLessThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min <=", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min like", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinNotLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_min not like", value, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("latitude_min in", values, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinNotIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("latitude_min not in", values, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("latitude_min between", value1, value2, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinNotBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("latitude_min not between", value1, value2, "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxIsNull() {
            addCriterion("latitude_max is null");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxIsNotNull() {
            addCriterion("latitude_max is not null");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max =", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxNotEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max <>", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxGreaterThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max >", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxGreaterThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max >=", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxLessThan(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max <", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxLessThanOrEqualTo(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max <=", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max like", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxNotLike(String value) {
            if(value == null)return (Criteria)this;
            addCriterion("latitude_max not like", value, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("latitude_max in", values, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxNotIn(List<String> values) {
            if(values == null)return (Criteria)this;
            addCriterion("latitude_max not in", values, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("latitude_max between", value1, value2, "latitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxNotBetween(String value1, String value2) {
            if(value1 == null || value2 == null)return (Criteria)this;
            addCriterion("latitude_max not between", value1, value2, "latitudeMax");
            return (Criteria) this;
        }

        @Override
        public String toString() {
            return "GeneratedCriteria [criteria=" + criteria + "]";
        }

        public Criteria andGridCodeLikeInsensitive(String value) {
            addCriterion("upper(grid_code) like", value.toUpperCase(), "gridCode");
            return (Criteria) this;
        }

        public Criteria andLongitudeMinLikeInsensitive(String value) {
            addCriterion("upper(longitude_min) like", value.toUpperCase(), "longitudeMin");
            return (Criteria) this;
        }

        public Criteria andLongitudeMaxLikeInsensitive(String value) {
            addCriterion("upper(longitude_max) like", value.toUpperCase(), "longitudeMax");
            return (Criteria) this;
        }

        public Criteria andLatitudeMinLikeInsensitive(String value) {
            addCriterion("upper(latitude_min) like", value.toUpperCase(), "latitudeMin");
            return (Criteria) this;
        }

        public Criteria andLatitudeMaxLikeInsensitive(String value) {
            addCriterion("upper(latitude_max) like", value.toUpperCase(), "latitudeMax");
            return (Criteria) this;
        }
    }

    /**
     * This class was generated by MyBatis Generator.
     * This class corresponds to the database table grid
     */
    public static class Criteria extends GeneratedCriteria {

        protected Criteria() {
            super();
        }

        @Override
        public String toString() {
            return "Criteria [->" + super.toString() + "]";
        }

        public Criteria setRowNum(String rowNum) {
            if(rowNum == null)return (Criteria)this;
            try {
                addCriterion("ROWNUM <=" + (Integer.parseInt(rowNum) + 1));
            } catch (NumberFormatException nfe) {
                throw new RuntimeException(nfe);
            }
            return this;
        }
    }

    /**
     * This class was generated by MyBatis Generator.
     * This class corresponds to the database table grid
     */
    public static class Criterion {
        private String condition;

        private Object value;

        private Object secondValue;

        private boolean noValue;

        private boolean singleValue;

        private boolean betweenValue;

        private boolean listValue;

        private String typeHandler;

        public String getCondition() {
            return condition;
        }

        public Object getValue() {
            return value;
        }

        public Object getSecondValue() {
            return secondValue;
        }

        public boolean isNoValue() {
            return noValue;
        }

        public boolean isSingleValue() {
            return singleValue;
        }

        public boolean isBetweenValue() {
            return betweenValue;
        }

        public boolean isListValue() {
            return listValue;
        }

        public String getTypeHandler() {
            return typeHandler;
        }

        protected Criterion(String condition) {
            super();
            this.condition = condition;
            this.typeHandler = null;
            this.noValue = true;
        }

        protected Criterion(String condition, Object value, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.typeHandler = typeHandler;
            if (value instanceof List<?>) {
                this.listValue = true;
            } else {
                this.singleValue = true;
            }
        }

        protected Criterion(String condition, Object value) {
            this(condition, value, null);
        }

        protected Criterion(String condition, Object value, Object secondValue, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.secondValue = secondValue;
            this.typeHandler = typeHandler;
            this.betweenValue = true;
        }

        protected Criterion(String condition, Object value, Object secondValue) {
            this(condition, value, secondValue, null);
        }

        @Override
        public String toString() {
            return "Criterion [condition=" + condition + ",value=" + value + ",secondValue=" + secondValue + ",noValue=" + noValue + ",singleValue=" + singleValue + ",betweenValue=" + betweenValue + ",listValue=" + listValue + ",typeHandler=" + typeHandler + "]";
        }
    }
}