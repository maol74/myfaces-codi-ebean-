package org.extrasapache.myfaces.codi.examples.ebean.support.ui.components.shuttle

import javax.faces.model.SelectItem
import collection.mutable.{ArrayBuffer, Buffer, LinkedHashMap}
import collection.JavaConversions._
import scala.math._

/**
 *
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

@serializable
class SortableListController {

  var _model: LinkedHashMap[String, SelectItem] = LinkedHashMap[String, SelectItem]()

  var _idx: Buffer[String] = ArrayBuffer[String]()

  var selections: java.util.List[String] = ArrayBuffer[String]()

  def model_$eq(source: java.util.Collection[SelectItem]) {
    _model = new LinkedHashMap[String, SelectItem]
    _idx = new ArrayBuffer[String]
    val buf = source
    buf.foreach(item => {
      _model.put(item.getValue.toString, item)
      _idx += item.getValue.toString
    }
    )
  }

  def model: java.util.Collection[SelectItem] = {
    //call the implicit conversion explicitely
    asMap[String, SelectItem](_model).values
  }

  def shuttleTop: String = {
    val res = _reorder(_shuttleTop, _idx, selections, _model)
    _model = res._1
    _idx = res._2

    null
  }

  def shuttleBottom: String = {
    val res = _reorder(_shuttleBottom, _idx, selections, _model)
    _model = res._1
    _idx = res._2

    null
  }

  def shuttleUp: String = {
    _idx = _membersUp(_idx, selections)
    _model = _sortMap(_idx, _model)

    null
  }

  def shuttleDown: String = {
    _idx = _membersDown(_idx, selections)
    _model = _sortMap(_idx, _model)

    null
  }

  def membersRemove: LinkedHashMap[String, SelectItem] = {
    val newModel = LinkedHashMap[String, SelectItem]()
    newModel.putAll(_model.filterKeys {
      !selections.contains(_)
    })
    val ret = LinkedHashMap[String, SelectItem]()
    ret.putAll(_model.filterKeys {
      selections.contains(_)
    })
    _idx.removeAll(ret.keySet)

    _model = newModel
    ret
  }


  def membersAdd(toAdd: LinkedHashMap[String, SelectItem]) = {
    _model.putAll(toAdd)
    _idx.addAll(toAdd.keySet)
  }

  def += (toAdd: LinkedHashMap[String, SelectItem]) = {
    membersAdd(toAdd)
  }

  //the following helpers work in a pure functional manner
  //and rely on immutable input output states
  //(so that we can switch easily between impls)

  protected def _membersUp(idx: Buffer[String], selections: Buffer[String]): Buffer[String] = {
    selections.foldLeft(idx.clone) {
      (idxClone, key) => {
        val pos = idxClone.indexOf(key)
        idxClone.remove(pos)
        idxClone.insert(max(pos - 1, 0), key)
        idxClone
      }
    }
  }

  protected def _membersDown(idx: Buffer[String], selections: Buffer[String]): Buffer[String] = {
    selections.foldLeft(idx.clone) {
      (idxClone, key) => {
        val pos = idxClone.indexOf(key)
        idxClone.remove(pos)
        idxClone.insert(max(pos + 1, idxClone.size - 1), key)
        idxClone
      }
    }
  }

  protected def _shuttleTop(list1: Buffer[String], list2: Buffer[String]): Buffer[String] = {
    list1 ++ list2
  }

  protected def _shuttleBottom(list1: Buffer[String], list2: Buffer[String]): Buffer[String] = {
    list2 ++ list1
  }

  protected def _reorder(applyClosure: (Buffer[String], Buffer[String]) => Buffer[String],
                idx: Buffer[String],
                selections: Buffer[String],
                dataMap: LinkedHashMap[String, SelectItem]
                 ):
  (LinkedHashMap[String, SelectItem], Buffer[String]) = {

    val filteredIdx = idx.filter(!selections.contains(_));
    val newIdx = applyClosure(selections, filteredIdx)
    val resMap = _sortMap(newIdx, dataMap)

    (resMap, newIdx)
  }

  protected def _sortMap(idx: Buffer[String], dataMap: LinkedHashMap[String, SelectItem]): LinkedHashMap[String, SelectItem] = {
    val resMap = LinkedHashMap[String, SelectItem]()
    idx.foreach(key =>
      resMap.put(key, dataMap.get(key).get)
    )
    resMap
  }
}

