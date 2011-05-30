package debug

import org.apache.myfaces.extensions.cdi.core.api.scope.conversation.ViewAccessScoped
import javax.faces.model.SelectItem
import javax.inject.Named

/**
 *
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

@ViewAccessScoped
@Named
@serializable
class SelectionHolder {

  import java.util.ArrayList

  var selectionModel = new ArrayList[SelectItem]
  var selectionValue = new ArrayList[SelectItem]

  //constructor initializer
  (0 until 10).foreach(item => {
    selectionModel.add(new SelectItem(item.toString, "item label" + item.toStr))
  })

  def doSelection: String = {
    print(selectionValue.size())

    return "selectionList"
  }
}