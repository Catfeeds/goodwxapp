﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SfSoft.web.game.qzsf
{
    public partial class agreement : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack) {
                if (Session["myopenid"] != null)
                {
                    hfOpenID.Value = Session["myopenid"].ToString();
                }
                else
                {
                    Response.Redirect("error.html");
                }
            }
        }
    }
}