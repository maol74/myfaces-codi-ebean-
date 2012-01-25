package org.extrasapache.myfaces.codi.examples.ebean.support.ui.components.tree.model

/**
 *
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 *
 * A simple tree model
 */

trait TreeModel {
    /**
     * returns the content
     * of the current node level
     * given the
     * @param label, which identifies the holding node
     */
     def getNodeLevel(label: String):TreeItem
}